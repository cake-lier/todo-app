import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import "./ItemsContainer.scss";
import {Item} from "../Item";
import axios from "axios";
import {CreateItemDialog} from "../itemDialogs/CreateItemDialog";

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
            <CreateItemDialog
                listId={listId}
                displayDialog={displayDialog}
                setDisplayDialog={setDisplayDialog}
                appendItem={appendItem}/>
        </>
    )
}