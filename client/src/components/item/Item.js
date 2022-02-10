import React, {useCallback, useRef, useState} from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import EditDueDateDialog from "./itemDialogs/EditDueDateDialog";
import EditReminderDateDialog from "./itemDialogs/EditReminderDateDialog";
import {ItemTag} from "./ItemTag";
import EditItemDialog from "./itemDialogs/EditItemDialog";
import {AssigneesDialog} from "./itemDialogs/AssigneesDialog";
import {EditTagDialog} from "./itemDialogs/EditTagDialog";
import axios from "axios";
import { Avatar } from "primereact/avatar";
import { Tag } from "primereact/tag";

export function Item({ item, listMembers, deleteItem, updateItem, displayError }){
    // item dots menu
    const menu = useRef(null);

    // dialogs
    const [displayEditDueDate, setDisplayEditDueDate] = useState(false);
    const [displayEditReminderDate, setDisplayEditReminderDate] = useState(false);
    const [displayEditTag, setDisplayEditTag] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [displayAssignees, setDisplayAssignees] = useState(false);

    // tags
    const [tags, setTags] = useState(item.tags);
    const updateTags = useCallback(t => setTags(t), [setTags]);
    const removeTag = useCallback(tag => setTags(tags.filter(t => t._id !== tag._id)), [tags, setTags]);

    // assignees
    const [assignees, setAssignees] = useState(item.assignees);

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
        console.log(e);
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
        { label: 'Edit tags', icon: 'pi pi-tag', command: () => { setDisplayEditTag(true) } },
        { label: 'Delete', icon: 'pi pi-trash', command: () => { deleteItem(item) } }
    ];

    return (
        <>
            <div className="flex justify-content-between m-2">
                <div>
                    <div className="field-checkbox m-1 mb-0">
                        <Checkbox
                            inputId={ item._id }
                            name="item"
                            value={ item }
                            onChange={ onCheckboxChecked }
                            checked={ !!item.completionDate }
                        />
                        <label htmlFor={ item._id }>{ item.title }</label>
                        <div className="flex align-items-center">
                            <p className="count-items flex m-1 text-xl" style={{ color: "#E61950" }}>x{ item.count }</p>
                        </div>
                        <span>
                            <i className={ (priority ? "pi pi-star-fill" : "pi pi-star") + " ml-2" } onClick={ togglePriority } />
                        </span>
                    </div>
                    <div className="flex align-items-center flex-wrap pl-4">
                        {
                            tags.map(tag =>
                                <ItemTag
                                    key={tag._id}
                                    itemId={item._id}
                                    tag={tag}
                                    removeTag={removeTag}
                                    text={tag.title}
                                    colorIndex={tag.colorIndex}
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
                                    className="flex m-1 p-tag-rounded"
                                    icon={
                                        <Avatar
                                            size="small"
                                            className="p-avatar-circle"
                                            image={
                                                assignee.profilePicturePath
                                                ? assignee.profilePicturePath
                                                : "/static/images/default_profile_picture.jpg"
                                            }
                                            alt={ assignee.username + " profile picture" }
                                            tooltip={ assignee.username }
                                        />
                                    }
                                >
                                    x{ assignee.count }
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
            <EditTagDialog
                itemId={ item._id }
                removeTag={ removeTag }
                tags={ tags }
                updateTags={ updateTags }
                display={ displayEditTag }
                setDisplay={ setDisplayEditTag }
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
