import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import Item from "../Item";
import axios from "axios";
import CreateItemDialog from "../itemDialogs/CreateItemDialog";
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyPlaceholder from "../../EmptyPlaceholder";
import "./ItemsContainer.scss";
import ListOptionsMenu from "../../ListOptionsMenu";
import {useNavigate} from "react-router-dom";

export default function ItemsContainer({ userId, setUser, list, setList, disabledNotificationsLists, socket, displayError }) {
    // checklist
    const [items, setItems] = useState([]);
    const [listMembers, setListMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(item => setItems(items.map(i => (i._id === item._id) ? item : i)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);
    // init items from database
    const getItems = useCallback(() => {
        axios.get(`/lists/${ list._id }/items/`)
             .then(
                 items => setItems(items.data),
                 error => displayError(error.response.data.error)
             )
             .then(_ => axios.get(`/lists/${ list._id }/members`))
             .then(
                 members => {
                     setListMembers(members.data);
                     setLoading(false);
                 },
                 error => displayError(error.response.data.error)
             );
    }, [displayError, list]);
    useEffect(getItems, [getItems]);
    useEffect(() => {
        function handleUpdates(event, eventListId) {
            if (list._id === eventListId
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
    }, [socket, list, getItems]);
    // delete item
    const deleteItem = (item) => {
        axios.delete("/items/" + item._id)
             .then(
                 _ => removeItem(item),
                 error => displayError(error.response.data.error)
             );
    }
    const [displayDialog, setDisplayDialog] = useState(false);
    const navigate = useNavigate();
    const updateList = useCallback(lists => {
        if (lists.length < 1) {
            navigate("/my-lists");
            return;
        }
        setList(lists[0])
    }, [navigate, setList]);
    return (
        <>
            <div className="grid flex-column flex-grow-1">
                <div className="col-12 m-0 p-0 pr-2 grid">
                    <div className="col-11 p-0">
                        <Button className="m-3"
                                label="New Item" icon="pi pi-plus"
                                onClick={() => setDisplayDialog(true)}
                        />
                    </div>
                    <ListOptionsMenu
                        userId={ userId }
                        setUser={ setUser }
                        ownership={ list.members.filter(m => m.userId === userId)[0].role === "owner" }
                        disabledNotificationsLists={ disabledNotificationsLists }
                        list={ list }
                        lists={ [list] }
                        setLists={ updateList }
                        displayError={ displayError }
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
                listId={ list._id }
                appendItem={ appendItem }
                displayDialog={ displayDialog }
                setDisplayDialog={ setDisplayDialog }
                displayError={ displayError }
            />
        </>
    )
}
