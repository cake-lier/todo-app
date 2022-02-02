import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import "./ItemsContainer.scss";
import {Item} from "../Item";
import axios from "axios";

export function ItemsContainer({listId}) {
    // checklist
    const [items, setItems] = useState([]);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);

    // init items from database
    useEffect(() => {
        axios.get("/items/")
            .then(allItems => {
                    setItems(allItems.data.filter(i => i.listId === listId));
                    // TODO show completed items as checked
                    // setSelectedItems(items => items.filter(i => i.completionDate !== null || i.completionDate !== ""));
                },
                // TODO error
            );
    }, [listId]);

    // when checkbox is checked/unchecked, update selectedItems[]
    const [selectedItems, setSelectedItems] = useState([]);
    const onItemChange = (e) => {
        let _selectedItems = [...selectedItems];

        if (e.checked) {
            _selectedItems.push(e.value);
            axios.put("/items/" + e.value._id + "/complete", {
                isComplete: true
            })
                .then(r => {
                        console.log("task " + e.value._id + " marked as completed.");
                    },
                    // TODO error msg
                 );
        } else {
            axios.put("/items/" + e.value._id + "/complete", {
                isComplete: false
            })
                .then(r => {
                        console.log("task " + e.value._id + " marked as incomplete.");
                    },
                    // TODO error msg
                );
            for (let i = 0; i < _selectedItems.length; i++) {
                const selectedItem = _selectedItems[i];

                if (selectedItem._id === e.value._id) {
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
        setDisplayDialog(false);
        axios.post(
            "/lists/" + listId + "/items",
            {
                listId: listId,
                title: itemName,
                count: setItemNum,
                assignees: []
            }
        ).then(item => {
            console.log("created item titled " + item.data.title);
            appendItem(item.data);
            setItemName('');
            setItemNum(1);
        });
    }

    // delete item
    const deleteItem = (item) => {
        axios.delete("/items/" + item._id).then(r => {
                console.log("item deleted");
                removeItem(item);
            },
            // TODO error msg
        );
    }

    const [displayDialog, setDisplayDialog] = useState(false);
    const renderFooter = () => {
        return (
            <div className="flex justify-content-center">
                <Button label='Create' onClick={onNewItem}/>
            </div>
        )
    }

    return (
        <>
            <div>
                <Button label="New Task" icon="pi pi-plus" onClick={() => setDisplayDialog(true)}/>
                {
                    items.map((item) => {
                        return (<Item key={item._id} item={item} onItemChange={onItemChange}
                                      selectedItems={selectedItems} deleteItem={deleteItem}/>)
                    })
                }
            </div>
            <Dialog header='Create a new task' footer={renderFooter} dismissableMask={true} closable={false}
                    visible={displayDialog} onHide={() => setDisplayDialog(false)}>
                <label htmlFor="inputItemName">Name</label>
                <span id="inputItemName" className="p-float-label">
                    <InputText id="itemName" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
                    <label htmlFor="itemName">Task Name</label>
                </span>

                <label htmlFor="num">Task number</label>
                <div className="grid">
                    <div className="field col-12 md:col-3">
                        <InputNumber
                            inputId="num" value={itemNum} onValueChange={(e) => setItemNum(e.value)} showButtons
                            buttonLayout="horizontal"
                            decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary"
                            incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                            min={1}/>
                    </div>
                </div>
            </Dialog>
        </>
    )
}