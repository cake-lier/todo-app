import React, {useRef, useState} from "react";
import {Checkbox} from "primereact/checkbox";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {ItemCount} from "./ItemCount";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import {DueDateDialog} from "./itemDialogs/dueDateDialog";
import {SetReminderDialog} from "./itemDialogs/setReminderDialog";

export function Item({socket, item, onItemChange, selectedItems, deleteItem}){
    // item dot menu
    const menu = useRef(null);
    let menuItems = [
        {label: 'Edit', icon: 'pi pi-pencil'},
        {label: 'Due date', icon: 'pi pi-calendar', command:()=>{setDisplayCalendar1(true)}},
        {label: 'Assign to', icon: 'pi pi-user-plus' },
        {label: 'Add reminder', icon: 'pi pi-bell', command:()=>{setDisplayCalendar2(true)}},
        {label: 'Add tags', icon: 'pi pi-tag' },
        {label: 'Add priority', icon: 'pi pi-star' },
        {label: 'Delete', icon: 'pi pi-trash', command:()=>{deleteItem(item)}}
    ];

    // calendar
    const [displayCalendar1, setDisplayCalendar1] = useState(false);
    const [displayCalendar2, setDisplayCalendar2] = useState(false);

    // const itemTemplate = (list) => {
    //     return (
    //
    //     );
    // }

    return (
        <>
            <div className="flex justify-content-between m-2">
                <div>
                    <div className="field-checkbox m-1 mb-0">
                        <Checkbox inputId={item._id}
                                  name="item" value={item}
                                  onChange={onItemChange}
                                  checked={selectedItems.some((i) => i._id === item._id)}
                        />
                        <label htmlFor={item._id}>{item.title}</label>
                        <ItemCount maxCount={item.count} />
                    </div>

                    <div className="flex align-items-center flex-wrap pl-4">
                        <Tag className="flex m-1 p-tag-rounded" icon="pi pi-calendar">Jan 11</Tag>
                        <Tag className="flex m-1 p-tag-rounded" icon="pi pi-circle-on">Unibo</Tag>
                    </div>
                </div>
                <Button icon="pi pi-ellipsis-v"
                        onClick={(e) => menu.current.toggle(e)}
                        className="p-button-rounded p-button-icon-only p-button-text" />
                <Menu model={menuItems} popup ref={menu} />
            </div>

            <DueDateDialog itemId={item._id} displayCalendar={displayCalendar1} setDisplayCalendar={setDisplayCalendar1} />
            <SetReminderDialog itemId={item._id} displayCalendar={displayCalendar2} setDisplayCalendar={setDisplayCalendar2} />
        </>
    )
}