import { useEffect, useRef, useState } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import EditDueDateDialog from "./itemDialogs/EditDueDateDialog";
import EditReminderDateDialog from "./itemDialogs/EditReminderDateDialog";
import ChipTag from "./ChipTag";
import EditItemDialog from "./itemDialogs/EditItemDialog";
import axios from "axios";
import AddTagDialog from "./itemDialogs/AddTagDialog";
import AddAssigneeDialog from "./itemDialogs/AddAssigneeDialog";
import {Chip} from "primereact/chip";
import ChipAssignee from "./ChipAssignee";
import "./Item.scss"

export default function Item({ item, listMembers, deleteItem, updateItem, displayError }){
    // item dots menu
    const menu = useRef(null);

    // dialogs
    const [displayEditDueDate, setDisplayEditDueDate] = useState(false);
    const [displayEditReminderDate, setDisplayEditReminderDate] = useState(false);
    const [displayAddTag, setDisplayAddTag] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [displayAssignees, setDisplayAssignees] = useState(false);

    // assignees
    const [assignees, setAssignees] = useState([]);
    useEffect(() => {
        axios.get(`/items/${ item._id }/assignees`)
             .then(
                 assignees => setAssignees(assignees.data),
                 error => displayError(error.response.data.error)
             );
    }, [setAssignees, displayError, item]);

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

    const removeDueDate = () => {
        axios.put(`/items/${ item._id }/dueDate`, { dueDate: null })
            .then(
                item => {
                    updateItem(item.data);
                    setDisplayEditDueDate(false);
                },
                error => displayError(error.response.data.error)
            );
    };

    const removeReminderDate = () => {
        axios.put(`/items/${ item._id }/reminderDate`, { reminderDate: null })
            .then(
                item => {
                    updateItem(item.data);
                    setDisplayEditReminderDate(false);
                },
                error => displayError(error.response.data.error)
            );
    };

    const menuItems = [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => { setDisplayEdit(true) } },
        { label: 'Edit due date', icon: 'pi pi-calendar', command: () => { setDisplayEditDueDate(true) } },
        { label: 'Edit reminder', icon: 'pi pi-bell', command: () => { setDisplayEditReminderDate(true) } },
        { label: 'Edit assignees', icon: 'pi pi-user-plus', command: () => { setDisplayAssignees(true) } },
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
                            item.tags.map(tag =>
                                <ChipTag
                                    key={ tag._id }
                                    itemId={ item._id }
                                    tag={ tag }
                                    updateItem={ updateItem }
                                />
                            )
                        }
                        {
                            item.dueDate
                            ? <Chip
                                  className="mr-1 mb-1"
                                  label={ new Date(item.dueDate).toLocaleDateString("en-GB")}
                                  icon="pi pi-calendar"
                                  removable
                                  onRemove={ removeDueDate }
                              />
                            : null
                        }
                        {
                            item.reminderDate
                            ? <Chip
                                  className="mr-1 mb-1"
                                  label={ new Date(item.reminderDate).toLocaleString("en-GB").replace(/:[^:]*$/, "") }
                                  icon="pi pi-bell"
                                  removable
                                  onRemove={ removeReminderDate }
                              />
                            : null
                        }
                        {
                            assignees.map(assignee =>
                                <ChipAssignee
                                    key={ assignee._id }
                                    itemId={ item._id }
                                    assignee={ assignee }
                                    updateItem={ updateItem }
                                    displayError={ displayError }
                                />
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
                updateItem={ updateItem }
                displayError={ displayError }
            />
            <EditItemDialog
                item={ item }
                updateItem={ updateItem }
                displayEdit={ displayEdit }
                setDisplayEdit={ setDisplayEdit }
                displayError={ displayError }
            />
            <AddAssigneeDialog
                item={ item }
                members={ listMembers }
                updateItem={ updateItem }
                display={ displayAssignees }
                setDisplay={ setDisplayAssignees }
                displayError={ displayError }
            />
        </>
    );
}
