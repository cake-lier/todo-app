import {useCallback, useEffect, useRef, useState} from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import EditDueDateDialog from "./itemDialogs/EditDueDateDialog";
import EditReminderDateDialog from "./itemDialogs/EditReminderDateDialog";
import ItemTag from "./ItemTag";
import EditItemDialog from "./itemDialogs/EditItemDialog";
import AssigneesDialog from "./itemDialogs/AssigneesDialog";
import axios from "axios";
import "./Item.scss"
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";
import AddTagDialog from "./itemDialogs/AddTagDialog";

export function Item({ item, listMembers, deleteItem, updateItem, displayError }){
    // item dots menu
    const menu = useRef(null);

    // dialogs
    const [displayEditDueDate, setDisplayEditDueDate] = useState(false);
    const [displayEditReminderDate, setDisplayEditReminderDate] = useState(false);
    const [displayAddTag, setDisplayAddTag] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [displayAssignees, setDisplayAssignees] = useState(false);

    // tags
    const [tags, setTags] = useState(item.tags);
    const updateTags = useCallback(t => setTags(t), [setTags]);
    const removeTag = useCallback(tag => setTags(tags.filter(t => t._id !== tag._id)), [tags, setTags]);

    // assignees
    const [assignees, setAssignees] = useState([]);
    useEffect(() => {
        axios.get(`/items/${ item._id }/assignees`)
             .then(
                 assignees => setAssignees(assignees.data),
                 error => displayError(error.response.data.error)
             );
    }, [setAssignees, displayError, item]);
    console.log(assignees);

    // priority star
    const [priority, setPriority] = useState(item.priority);

    const togglePriority = () => {
        setPriority(!priority);
        axios.put(`/items/${ item._id }/priority`, { priority: !priority })
             .then(
                 item => updateItem(item.data),
                 error => displayError(error.response.data.error)
             );
    };

    const onCheckboxChecked = e => {
        axios.put(`/items/${ e.value._id }/complete`, { isComplete: e.checked })
            .then(
                item => updateItem(item.data),
                error => displayError(error.response.data.error)
            );
    };

    const menuItems = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => { setDisplayEdit(true) } },
        { label: 'Edit due date', icon: 'pi pi-calendar', command: () => { setDisplayEditDueDate(true) } },
        { label: 'Edit reminder', icon: 'pi pi-bell', command: () => { setDisplayEditReminderDate(true) } },
        { label: 'Assign to', icon: 'pi pi-user-plus', command: () => { setDisplayAssignees(true) } },
        { label: 'Add a new tag', icon: 'pi pi-tag', command: () => { setDisplayAddTag(true) } },
        { label: 'Delete', icon: 'pi pi-trash', className: "red-color", command: () => { deleteItem(item) } }
    ];

    return (
        <>
            <div className="flex justify-content-between m-2 mx-3">
                <div>
                    <div className="field-checkbox m-1 mb-0">
                        <Checkbox
                            inputId={ item._id }
                            name="item"
                            value={ item }
                            onChange={ onCheckboxChecked }
                            checked={ !!item.completionDate }
                        />
                        <label className="text-xl" htmlFor={ item._id }>{ item.title }</label>
                        <div className="flex align-items-center">
                            <p className="count-items flex m-1 text-xl" style={{ color: "#E61950" }}>x{ item.count }</p>
                        </div>
                        <span className={(priority ? "priority-star-fill" : "priority-star")}>
                            <i className={ (priority ? "pi pi-star-fill" : "pi pi-star") + " ml-2 text-xl cursor-pointer" } onClick={ togglePriority } />
                        </span>
                    </div>
                    <div className="flex align-items-center flex-wrap pl-5">
                        {
                            tags.map(tag =>
                                <ItemTag
                                    key={ tag._id }
                                    itemId={ item._id }
                                    tag={ tag }
                                    removeTag={ removeTag }
                                />
                            )
                        }
                        {
                            item.dueDate
                            ? <Tag className="flex m-1 p-tag-rounded" icon={ <i className="pi mr-1 pi-calendar" /> }>
                                  { new Date(item.dueDate).toLocaleDateString("en-GB")}
                              </Tag>
                            : null
                        }
                        {
                            item.reminderDate
                            ? <Tag className="flex m-1 p-tag-rounded" icon={ <i className="pi mr-1 pi-bell" /> }>
                                  { new Date(item.reminderDate).toLocaleString("en-GB").replace(/:[^:]*$/, "") }
                              </Tag>
                            : null
                        }
                        {
                            assignees.map(assignee =>
                                <Tag
                                    key={ assignee._id }
                                    className="flex m-1 p-tag-rounded assignee"
                                    icon={
                                        <Avatar
                                            size="small"
                                            className="p-avatar-circle assignee"
                                            image={
                                                assignee.profilePicturePath
                                                ? assignee.profilePicturePath
                                                : "/static/images/default_profile_picture.jpg"
                                            }
                                            alt={ assignee.username + " profile picture" }
                                        />
                                    }
                                >
                                    { assignee.username } x{ assignee.count }
                                </Tag>
                            )
                        }
                    </div>
                </div>
                <Button
                    icon="pi pi-ellipsis-h"
                    onClick={ e => menu.current.toggle(e) }
                    className="p-button-rounded p-button-icon-only p-button-text three-dots"
                />
                <Menu model={ menuItems } popup ref={ menu } />
            </div>
            <EditDueDateDialog
                item={ item }
                updateItem={ updateItem }
                displayEditDueDate={ displayEditDueDate }
                setDisplayEditDueDate={ setDisplayEditDueDate }
                displayError={ displayError }
            />
            <EditReminderDateDialog
                item={ item }
                updateItem={ updateItem }
                displayEditReminderDate={ displayEditReminderDate }
                setDisplayEditReminderDate={ setDisplayEditReminderDate }
                displayError={ displayError }
            />
            <AddTagDialog
                itemId={ item._id }
                display={ displayAddTag }
                setDisplay={ setDisplayAddTag }
                updateTags={ updateTags }
                displayError={ displayError }
            />
            <EditItemDialog
                item={ item }
                updateItem={ updateItem }
                displayEdit={ displayEdit }
                setDisplayEdit={ setDisplayEdit }
                displayError={ displayError }
            />
            <AssigneesDialog
                itemId={ item._id }
                display={ displayAssignees }
                setDisplay={ setDisplayAssignees }
                listMembers={ listMembers }
                assignees={ assignees }
                setAssignees={ setAssignees }
                displayError={ displayError }
            />
        </>
    );
}
