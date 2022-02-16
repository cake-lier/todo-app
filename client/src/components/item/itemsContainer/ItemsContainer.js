import {useState, useCallback, useEffect, useRef} from 'react';
import { Button } from 'primereact/button';
import Item from "../Item";
import axios from "axios";
import CreateItemDialog from "../itemDialogs/CreateItemDialog";
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyPlaceholder from "../../EmptyPlaceholder";
import "./ItemsContainer.scss";
import ListOptionsMenu from "../../ListOptionsMenu";
import {useNavigate} from "react-router-dom";
import {Menu} from "primereact/menu";
import {DataView} from "primereact/dataview";

export default function ItemsContainer({ userId, anonymousId, setUser, list, setList, members, setMembers, disabledNotificationsLists, socket, displayError }) {
    // checklist
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(item => setItems(items.map(i => (i._id === item._id) ? item : i)), [items, setItems]);
    const removeItem = useCallback(item => setItems(items.filter(i => i._id !== item._id)), [items, setItems]);
    const [ordering, setOrdering] = useState(null);
    const menu = useRef();
    const menuItems = [
        { label: "Name ascending", icon: "pi pi-sort-alpha-down", command: _ => setOrdering(0) },
        { label: "Name descending", icon: "pi pi-sort-alpha-up", command: _ => setOrdering(1) },
        { label: "Creation ascending", icon: "pi pi-sort-numeric-down", command: _ => setOrdering(2) },
        { label: "Creation descending", icon: "pi pi-sort-numeric-up", command: _ => setOrdering(3) }
    ];
    const getSortField = ordering => {
        switch (ordering) {
            case 0:
            case 1:
                return "title";
            case 2:
            case 3:
                return "creationDate";
            default:
                return null;
        }
    };
    const getSortOrder = ordering => {
        switch (ordering) {
            case 0:
            case 2:
                return 1;
            case 1:
            case 3:
                return -1;
            default:
                return null;
        }
    };
    // init items from database
    const getItems = useCallback(() => {
        axios.get(`/lists/${ list._id }/items/`, { params: anonymousId !== null ? { anonymousId } : {} })
             .then(
                 items => {
                     setItems(items.data);
                     setLoading(false);
                 },
                 error => displayError(error.response.data.error)
             );
    }, [displayError, list, anonymousId]);
    useEffect(getItems, [getItems]);
    useEffect(() => {
        function handleUpdates(event, eventListId) {
            if (list._id === eventListId
                && new RegExp(
                       "^item(?:Created|(?:Title|DueDate|ReminderDate|Priority|Completion|Count)Changed|Tags(?:Added|Removed)"
                       + "|Assignee(?:Added|Removed|Updated)|Deleted)Reload$"
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
        axios.delete("/items/" + item._id, { params: anonymousId !== null ? { anonymousId } : {} })
             .then(
                 _ => removeItem(item),
                 error => displayError(error.response.data.error)
             );
    };
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
                    <div className="col-10 p-0">
                        <Button className="m-3"
                                label="New Item" icon="pi pi-plus"
                                onClick={() => setDisplayDialog(true)}
                        />
                    </div>
                    <div className="col-2 m-0 pl-1 flex align-items-center justify-content-end">
                        <Button
                            className="my-2"
                            id="order-button"
                            label="Sort by"
                            icon="pi pi-sort-amount-down-alt"
                            onClick={ e => menu.current.toggle(e) }
                        />
                        <Menu model={ menuItems } popup ref={ menu } />
                        <ListOptionsMenu
                            userId={ userId }
                            anonymousId={ anonymousId }
                            setUser={ setUser }
                            members={ members }
                            setMembers={ setMembers }
                            ownership={ userId ? list.members.filter(m => m.userId === userId)[0].role === "owner" : false }
                            disabledNotificationsLists={ disabledNotificationsLists }
                            list={ list }
                            lists={ [list] }
                            setLists={ updateList }
                            displayError={ displayError }
                        />
                    </div>
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
                        ? <DataView
                              className="w-full"
                              value={ items }
                              layout="list"
                              itemTemplate={ item =>
                                  <Item
                                      key={ item._id }
                                      item={ item }
                                      anonymousId={ anonymousId }
                                      listMembers={ members }
                                      deleteItem={ deleteItem }
                                      updateItem={ updateItem }
                                      displayError={ displayError }
                                  />
                              }
                              rows={ 10 }
                              paginator={ items.length > 10 }
                              alwaysShowPaginator={ false }
                              sortField={ getSortField(ordering) }
                              sortOrder={ getSortOrder(ordering) }
                          />
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
                anonymousId={ anonymousId }
                appendItem={ appendItem }
                displayDialog={ displayDialog }
                setDisplayDialog={ setDisplayDialog }
                displayError={ displayError }
            />
        </>
    )
}
