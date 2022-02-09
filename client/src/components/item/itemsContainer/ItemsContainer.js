import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import "./ItemsContainer.scss";
import {Item} from "../Item";
import axios from "axios";
import {CreateItemDialog} from "../itemDialogs/CreateItemDialog";

export function ItemsContainer({ listId, myDayItems, displayError }) {
    // checklist
    const [items, setItems] = useState([]);
    const [listMembers, setListMembers] = useState([]);
    // when checkbox is checked/unchecked, update selectedItems[]
    const [selectedItems, setSelectedItems] = useState([]);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(item => setItems(items.map(i => (i._id === item._id) ? item : i)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);
    // init items from database
    useEffect(() => {
        if (listId) {
            axios.get(`/lists/${ listId }/items/`)
                 .then(
                     items => {
                        setItems(items.data);
                        setSelectedItems(items.data.filter(j => j.completionDate !== null));
                    },
                    error => displayError(error.response.data.error)
                );
        } else {
            setItems(myDayItems);
        }
        axios.get(`/lists/${ listId }/members`)
             .then(
                  members => setListMembers(members.data),
                  error => displayError(error.response.data.error)
             );
    }, [listId, myDayItems, setItems, setSelectedItems, setListMembers, displayError]);

    console.log(items);
    const onItemChange = e => {
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
        axios.delete("/items/" + item._id)
             .then(
                 _ => removeItem(item),
                 error => displayError(error.response.data.error)
             );
    }

    const [displayDialog, setDisplayDialog] = useState(false);

    return (
        <>
            <div>
                <Button className={myDayItems ? "hidden" : null}
                        label="New Task"
                        icon="pi pi-plus"
                        onClick={() => setDisplayDialog(true)}
                />
                {
                    items.map(item =>
                        <Item
                            key={ item._id }
                            item={ item }
                            listMembers={ listMembers }
                            onItemChange={ onItemChange }
                            selectedItems={ selectedItems }
                            deleteItem={ deleteItem }
                            updateItem={ updateItem }
                            displayError={ displayError }
                        />
                    )
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
