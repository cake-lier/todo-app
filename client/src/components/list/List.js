import React, { useState } from "react";
import "./List.scss";
import {Item} from "../Item";
import { Button } from 'primereact/button';
import {Dialog} from "primereact/dialog";
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';

export function List(props) {
    // checklist
    const listName = props.name;
    const items = [{name: 'Take a picture', key: '00', count: 5},
                    {name: 'Write report', key: '01', count: 6},
                    {name: 'Production', key: '02', count: 7},
                    {name: 'Research', key: '03', count: 8}];
    // when checkbox is checked/unchecked, update selectedItems[]
    const [selectedItems, setSelectedItems] = useState(Array.prototype);
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

    // create item
    const [itemName, setItemName] = useState('');
    const [itemNum, setItemNum] = useState(1);
    const onNewItem = () => {
        console.log("onNewItem; name: " + itemName + "; itemNum: " + itemNum);
        setDisplayDialog(false);
        // TODO: axios post
    }

    const [displayDialog, setDisplayDialog] = useState(false);
    const renderFooter = () => {
        return (
            <div  className="flex justify-content-center">
                <Button label='Create' onClick={onNewItem}/>
            </div>
        )
    }

    return (
        <>
        <div>
            <h2 className="font-medium text-3xl text-900">{listName}</h2>
            <Button label="New Task" icon="pi pi-plus" onClick={ () => setDisplayDialog(true)}/>
            {
                items.map((item) => {
                    return( <Item key={item.key} item={item} onItemChange={onItemChange} selectedItems={selectedItems}/>)
                })
            }
        </div>
        <Dialog header='Create a new task' footer={renderFooter} dismissableMask={true} closable={false} visible={displayDialog} onHide={() => setDisplayDialog(false)}>
            <label htmlFor="inputItemName">Name</label>
            <span id="inputItemName" className="p-float-label">
                <InputText id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                <label htmlFor="itemName">Task Name</label>
            </span>

            <label htmlFor="num">Task number</label>
            <div className="grid">
                <div className="field col-12 md:col-3">
                    <InputNumber
                                 inputId="num" value={itemNum} onValueChange={(e) => setItemNum(e.value)}  showButtons buttonLayout="horizontal"
                                 decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                 min={1} />
                </div>
            </div>
        </Dialog>
        </>
    )
}