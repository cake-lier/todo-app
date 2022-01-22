import React, { useState, useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import "./List.scss";
import {io} from "socket.io-client";

export function List(props) {
    // checklist
    const listName = props.name;
    const items = [{name: 'Take a picture', key: '00'},
                    {name: 'Write report', key: '01'},
                    {name: 'Production', key: '02'},
                    {name: 'Research', key: '03'}];
    const [selectedItems, setSelectedItems] = useState(Array.prototype);

    // task menu
    const menu = useRef(null);
    let menuItems = [
        {label: 'Edit', icon: 'pi pi-pencil'},
        {label: 'Due date', icon: 'pi pi-calendar', command:()=>{setDisplayCalendar1(true); triggerSocket();}},
        {label: 'Assign to', icon: 'pi pi-user-plus' },
        {label: 'Add reminder', icon: 'pi pi-bell', command:()=>{setDisplayCalendar2(true)}},
        {label: 'Add tags', icon: 'pi pi-tag' },
        {label: 'Add priority', icon: 'pi pi-star' },
        {label: 'Delete', icon: 'pi pi-trash'}
    ];

    // calendar
    const [displayCalendar1, setDisplayCalendar1] = useState(false);
    const [displayCalendar2, setDisplayCalendar2] = useState(false);
    const dialogFuncMap = {
        'display1': setDisplayCalendar1,
        'display2': setDisplayCalendar2
    }
    const [date1, setDate1] = useState(null);
    const [date2, setDate2] = useState(null);

    // when checkbox is checked/unchecked, update selectedItems[]
    const onItemChange = (e) => {
        let _selectedItems = [...selectedItems];

        if (e.checked) {
            _selectedItems.push(e.value);
        }
        else {
            for (let i = 0; i < _selectedItems.length; i++) {
                const selectedItem = _selectedItems[i];

                if (selectedItem.key === e.value.key) {
                    _selectedItems.splice(i, 1);
                    break;
                }
            }
        }
        setSelectedItems(_selectedItems);
    }

    // dialogs containing calendars
    const calendarFooter = (btn_text, display) => {
        return (
            <div  className="flex justify-content-center">
                <Button label={btn_text} onClick={() => onHide(display)} />
            </div>
        )
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }

    // socket testing
    function triggerSocket() {
        props.socket.emit('duedate');
    }

    return (
        <div>
            <h2 className="font-medium text-3xl text-900">{listName}</h2>
            {
                items.map((item) => {
                    return (
                        <div className="flex justify-content-between m-2">
                            <div>
                                <div key={item.key} className="field-checkbox m-1">
                                    <Checkbox inputId={item.key}
                                              name="item" value={item}
                                              onChange={onItemChange}
                                              checked={selectedItems.some((i) => i.key === item.key)}
                                    />
                                    <label htmlFor={item.key}>{item.name}</label>
                                </div>
                                <div className="flex align-items-center flex-wrap">
                                    <Tag className="flex m-1 p-tag-rounded" icon="pi pi-calendar">Jan 11</Tag>
                                    <Tag className="flex m-1 p-tag-rounded" icon="pi pi-circle-on">Unibo</Tag>
                                </div>
                            </div>
                            <Button icon="pi pi-ellipsis-v"
                                    onClick={(e) => menu.current.toggle(e)}
                                    className="p-button-rounded p-button-icon-only p-button-text" />
                            <Menu model={menuItems} popup ref={menu} />
                            </div>
                    )
                })
            }

            <Dialog footer={calendarFooter('Set due date', 'display1')} dismissableMask={true} closable={false} visible={displayCalendar1} onHide={() => setDisplayCalendar1(false)}>
                <Calendar id="time24" value={date1} onChange={(e) => setDate1(e.value)} inline stepMinute={2} />
            </Dialog>

            <Dialog footer={calendarFooter('Set reminder', 'display2')} dismissableMask={true} closable={false} visible={displayCalendar2} onHide={() => setDisplayCalendar2(false)}>
                <Calendar id="time24" value={date2} onChange={(e) => setDate2(e.value)} showTime inline stepMinute={2} />
            </Dialog>

        </div>
    )
}