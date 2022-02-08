import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import "./ItemsContainer.scss";
import {Item} from "../Item";
import axios from "axios";
import {CreateItemDialog} from "../itemDialogs/CreateItemDialog";
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyPlaceholder from "../../EmptyPlaceholder";

export function ItemsContainer({listId, myDayItems}) {
    // checklist
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(item => setItems(items.map(i => (i._id === item._id) ? item : i)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);

    const [listMembers, setListMembers] = useState([]);

    // init items from database
    useEffect(() => {
        if (listId) {
            axios.get("/items/")
                .then(allItems => {
                        let i = allItems.data.filter(i => i.listId === listId);
                        setItems(i);
                        setSelectedItems(i.filter(j => j.completionDate !== null && j.completionDate !== ""));
                    },
                    // TODO error msg
                )
                .then(_ => setLoading(false))

            // init list members
            axios.get("/lists/" + listId + "/members")
            .then(members => setListMembers(members.data),
            // TODO error msg
            );
        } else {
            setItems(myDayItems);
        }
    }, [listId, setLoading]);

    // when checkbox is checked/unchecked, update selectedItems[]
    const [selectedItems, setSelectedItems] = useState([]);
    const onItemChange = (e) => {
        let _selectedItems = [...selectedItems];

        if (e.checked) {
            _selectedItems.push(e.value);
            axios.put("/items/" + e.value._id + "/complete", {
                isComplete: true
            })
                .then(r => console.log("task " + e.value._id + " marked as completed."),
                    // TODO error msg
                 );
        } else {
            axios.put("/items/" + e.value._id + "/complete", {
                isComplete: false
            })
                .then(r => console.log("task " + e.value._id + " marked as incomplete."),
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
        axios.delete("/items/" + item._id).then(r => removeItem(item),
            // TODO error msg
        );
    }

    const [displayDialog, setDisplayDialog] = useState(false);

    return (
        <>
            <div className="grid flex-column flex-grow-1">
                <div className="col-12 m-0 p-0 flex">
                    <Button className={"m-3 " + (myDayItems ? "hidden" : null)}
                            label="New Task" icon="pi pi-plus"
                            onClick={() => setDisplayDialog(true)}
                    />
                </div>
                {
                    loading ?
                        <ProgressSpinner
                            className={"col-12 flex flex-grow-1 flex-column justify-content-center align-content-center " + (loading? null : "hidden")}
                            style={{width: '50px', height: '50px'}}
                            strokeWidth="2"
                            fill="var(--surface-ground)"
                            animationDuration=".5s"
                        />
                        : items.length ?
                            items.map((item) => {
                                return (<Item key={item._id}
                                      item={item}
                                      listMembers={listMembers}
                                      onItemChange={onItemChange}
                                      selectedItems={selectedItems}
                                      deleteItem={deleteItem}
                                      updateItem={updateItem} />)
                            })
                        : <div className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                                <EmptyPlaceholder
                                    title={ "No items to display" }
                                    subtitle={ "Items that have a due date will show up here." }
                                    type={"items"}
                                />
                            </div>
                }
            </div>
            <CreateItemDialog
                listId={listId}
                appendItem={appendItem}
                displayDialog={displayDialog}
                setDisplayDialog={setDisplayDialog}
                />
        </>
    )
}