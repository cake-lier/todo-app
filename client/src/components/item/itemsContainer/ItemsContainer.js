import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import Item from "../Item";
import axios from "axios";
import CreateItemDialog from "../itemDialogs/CreateItemDialog";
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyPlaceholder from "../../EmptyPlaceholder";
import "./ItemsContainer.scss";

export function ItemsContainer({ listId, socket, displayError }) {
    // checklist
    const [items, setItems] = useState([]);
    const [listMembers, setListMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(item => setItems(items.map(i => (i._id === item._id) ? item : i)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);
    // init items from database
    const getItems = useCallback(() => {
        axios.get(`/lists/${ listId }/items/`)
             .then(
                 items => setItems(items.data),
                 error => displayError(error.response.data.error)
             )
             .then(_ => axios.get(`/lists/${ listId }/members`))
             .then(
                 members => {
                     setListMembers(members.data);
                     setLoading(false);
                 },
                 error => displayError(error.response.data.error)
             );
    }, [displayError, listId]);
    useEffect(getItems, [getItems]);
    useEffect(() => {
        function handleUpdates(event, eventListId) {
            if (listId === eventListId
                && new RegExp(
                       "^item(?:Created|(?:Title|DueDate|Reminder|Priority|Completion|Count)Changed|Tags(?:Added|Removed)"
                       + "|Assignee(?:Added|Removed)|Deleted)Reload$"
                   ).test(event)
            ) {
                getItems();
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [socket, listId, getItems]);
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
            <div className="grid flex-column flex-grow-1">
                <div className="col-12 m-0 p-0 flex">
                    <Button className="m-3"
                            label="New Item" icon="pi pi-plus"
                            onClick={() => setDisplayDialog(true)}
                    />
                </div>
                {
                    loading
                    ? <ProgressSpinner
                          className={
                            "col-12 flex flex-grow-1 flex-column justify-content-center align-content-center "
                            + (loading ? null : "hidden")
                          }
                          style={{width: '50px', height: '50px'}}
                          strokeWidth="2"
                          fill="var(--surface-ground)"
                          animationDuration=".5s"
                      />
                    : (
                        items.length
                        ? items.map(item =>
                              <Item
                                  key={ item._id }
                                  item={ item }
                                  listMembers={ listMembers }
                                  deleteItem={ deleteItem }
                                  updateItem={ updateItem }
                                  displayError={ displayError }
                              />
                          )
                        : <div className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                              <EmptyPlaceholder
                                  title={ "No items to display" }
                                  subtitle={ "Items that have a due date will show up here." }
                                  type={"items"}
                              />
                          </div>
                      )
                }
            </div>
            <CreateItemDialog
                listId={ listId }
                appendItem={ appendItem }
                displayDialog={ displayDialog }
                setDisplayDialog={ setDisplayDialog }
                displayError={ displayError }
            />
        </>
    )
}
