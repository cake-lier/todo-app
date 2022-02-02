import React, {useCallback, useRef, useState} from "react";
import {Checkbox} from "primereact/checkbox";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {ItemCount} from "./ItemCount";
import {DueDateDialog} from "./itemDialogs/dueDateDialog";
import {SetReminderDialog} from "./itemDialogs/setReminderDialog";
import {ItemTag} from "./itemTag/ItemTag";
import {AddTagDialog} from "./itemDialogs/AddTagDialog";
import axios from "axios";

export function Item({socket, item, onItemChange, selectedItems, deleteItem}){
    // item dot menu
    const menu = useRef(null);
    let menuItems = [
        {label: 'Edit', icon: 'pi pi-pencil'},
        {label: 'Due date', icon: 'pi pi-calendar', command:()=>{setDisplayCalendar1(true)}},
        {label: 'Assign to', icon: 'pi pi-user-plus' },
        {label: 'Add reminder', icon: 'pi pi-bell', command:()=>{setDisplayCalendar2(true)}},
        {label: 'Add tags', icon: 'pi pi-tag', command:()=>{setDisplayAddTag(true)}},
        {label: 'Add priority', icon: 'pi pi-star' },
        {label: 'Delete', icon: 'pi pi-trash', command:()=>{deleteItem(item)}}
    ];

    // dialogs
    const [displayCalendar1, setDisplayCalendar1] = useState(false);
    const [displayCalendar2, setDisplayCalendar2] = useState(false);
    const [displayAddTag, setDisplayAddTag] = useState(false);

    // tags
    const [tags, setTags] = useState(item.tags);
    const updateTags = useCallback(t => setTags(t), [tags, setTags]);

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
                        {
                            tags.map((tag) => {
                                return (<ItemTag key={tag._id} itemId={item._id} text={tag.title} colorIndex={tag.colorIndex}/> )
                            })
                        }
                    </div>
                </div>
                <Button icon="pi pi-ellipsis-v"
                        onClick={(e) => menu.current.toggle(e)}
                        className="p-button-rounded p-button-icon-only p-button-text" />
                <Menu model={menuItems} popup ref={menu} />
            </div>

            <DueDateDialog itemId={item._id} displayCalendar={displayCalendar1} setDisplayCalendar={setDisplayCalendar1} />
            <SetReminderDialog itemId={item._id} displayCalendar={displayCalendar2} setDisplayCalendar={setDisplayCalendar2} />
            <AddTagDialog itemId={item._id} display={displayAddTag} setDisplay={setDisplayAddTag} updateTags={updateTags} />
        </>
    )
}