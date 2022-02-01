import {Checkbox} from "primereact/checkbox";
import {Tag} from "primereact/tag";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import React, {useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Calendar} from "primereact/calendar";
import {ItemCount} from "./ItemCount";

export function Item({socket, item, onItemChange, selectedItems}){
    // item dot menu
    const menu = useRef(null);
    let menuItems = [
        {label: 'Edit', icon: 'pi pi-pencil'},
        {label: 'Due date', icon: 'pi pi-calendar', command:()=>{setDisplayCalendar1(true)}},
        {label: 'Assign to', icon: 'pi pi-user-plus' },
        {label: 'Add reminder', icon: 'pi pi-bell', command:()=>{setDisplayCalendar2(true)}},
        {label: 'Add tags', icon: 'pi pi-tag' },
        {label: 'Add priority', icon: 'pi pi-star' },
        {label: 'Delete', icon: 'pi pi-trash', command:()=>{deleteItem()}}
    ];

    // delete item
    const deleteItem = () => {
        console.log("id: " + item.id + "| _id: " + item._id);
    }

    // calendar
    const [displayCalendar1, setDisplayCalendar1] = useState(false);
    const [displayCalendar2, setDisplayCalendar2] = useState(false);
    const dialogFuncMap = {
        'display1': setDisplayCalendar1,
        'display2': setDisplayCalendar2
    }
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);

    // dialogs containing calendars
    const dueDateFooter = (btn_text, display) => {
        return (
            <div  className="flex justify-content-center">
                <Button label={btn_text} onClick={() => {
                    onHide(display);
                    socket.emit('reminder', date2);
                }} />
            </div>
        )
    }

    const reminderFooter = (btn_text, display) => {
        return (
            <div  className="flex justify-content-center">
                <Button label={btn_text} onClick={() => {
                    onHide(display);
                    socket.emit('reminder', date2);
                }} />
            </div>
        )
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

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

        <Dialog footer={dueDateFooter('Set due date', 'display1')} dismissableMask={true} closable={false} visible={displayCalendar1} onHide={() => setDisplayCalendar1(false)}>
            <Calendar id="time24" value={date1} onChange={(e) => setDate1(e.value)} inline stepMinute={2} />
        </Dialog>

        <Dialog footer={reminderFooter('Set reminder', 'display2')} dismissableMask={true} closable={false} visible={displayCalendar2} onHide={() => setDisplayCalendar2(false)}>
            <Calendar id="time24" value={date2} onChange={(e) => setDate2(e.value)} showTime inline stepMinute={2} />
        </Dialog>
        </>
    )
}