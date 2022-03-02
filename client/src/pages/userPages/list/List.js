import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import JoinDialog from "../../../components/userPages/list/joinDialog/JoinDialog";
import ItemsContainer from "../../../components/userPages/list/itemsContainer/ItemsContainer";
import ListHeader from "../../../components/userPages/list/listHeader/ListHeader";

export default function List({
    user,
    anonymousId,
    unsetAnonymousId,
    setUser,
    unsetUser,
    notifications,
    setNotifications,
    hideCompleted,
    setHideCompleted,
    socket
}) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const { id } = useParams();
    const [members, setMembers] = useState([]);
    const [list, setList] = useState(null);
    const getHeader = useCallback(() => {
        axios.get(`/lists/${ id }`, { params: anonymousId !== null ? { anonymousId } : {} })
             .then(
                list => {
                    setList(list.data);
                    axios.get(`/lists/${ id }/members`, { params: anonymousId !== null ? { anonymousId } : {} })
                         .then(
                             members => setMembers(members.data),
                             error => displayError(error.response.data.error)
                         );
                },
                error => displayError(error.response.data.error)
            );
    }, [id, setList, displayError, anonymousId]);
    useEffect(getHeader, [getHeader]);
    const navigate = useNavigate();
    useEffect(() => {
        function handleUpdates(event, listId) {
            if (listId === id) {
                if (/^list(?:TitleChanged|Member(?:Added|Removed))Reload$/.test(event)) {
                    getHeader();
                } else if (/^list(?:Deleted|SelfRemoved)Reload$/.test(event)) {
                    if (user) {
                        navigate("/my-day");
                    } else {
                        unsetAnonymousId();
                    }
                }
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [id, socket, getHeader, navigate, unsetAnonymousId, user]);
    const updateList = useCallback(lists => {
        if (lists.length < 1) {
            navigate("/my-lists");
            return;
        }
        setList(lists[0]);
    }, [navigate, setList]);
    const [ordering, setOrdering] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const appendItem = useCallback(item => setItems(items.concat(item)), [items, setItems]);
    const updateItem = useCallback(
        item => setItems(items.map(i => (i._id === item._id) ? item : i).filter(i => !hideCompleted || !i.completionDate)),
        [items, setItems, hideCompleted]
    );
    const deleteItem = useCallback(item => {
        axios.delete("/items/" + item._id, { params: anonymousId !== null ? { anonymousId } : {} })
            .then(
                _ => setItems(items.filter(i => i._id !== item._id)),
                error => displayError(error.response.data.error)
            );
    }, [anonymousId, displayError, items, setItems]);
    const getItems = useCallback(() => {
        axios.get(`/lists/${ id }/items/`, { params: anonymousId !== null ? { anonymousId } : {} })
             .then(
                 items => {
                     setItems(items.data.filter(item => !hideCompleted || !item.completionDate));
                     setLoading(false);
                 },
                 error => displayError(error.response.data.error)
             );
    }, [displayError, id, anonymousId, setItems, setLoading, hideCompleted]);
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
    if (list === null) {
        return null;
    }
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <JoinDialog listId={ id } socket={ socket } displayError={ displayError } />
            {
                user
                ? <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                      <SideMenu selected={ null } />
                  </div>
                : null
            }
            <div
                id="myListsContainer"
                style={{ backgroundColor: "white", width: (user ? "90%" : "100%") }}
                className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex"
            >
                <PageHeader
                    user={ user }
                    isAnonymous={ !!anonymousId }
                    unsetUser={ unsetUser }
                    title={ list.title }
                    members={ members }
                    showDate={ false }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <ListHeader
                    userId={ user?._id }
                    setUser={ setUser }
                    anonymousId={ anonymousId }
                    members={ members }
                    setMembers={ setMembers }
                    list={ list }
                    updateList={ updateList }
                    disabledNotificationsLists={ user ? user.disabledNotificationsLists: [] }
                    setOrdering={ setOrdering }
                    appendItem={ appendItem }
                    hideCompleted={ hideCompleted }
                    setHideCompleted={ setHideCompleted }
                    displayError={ displayError }
                />
                <ItemsContainer
                    anonymousId={ anonymousId }
                    items={ items }
                    members={ members }
                    ordering={ ordering }
                    loading={ loading }
                    updateItem={ updateItem }
                    deleteItem={ deleteItem }
                    displayError={ displayError }
                />
            </div>
            <div className="w-full p-0 md:hidden"  style={{backgroundColor: "white"}}>
                <div className="mx-0 p-0 h-full flex-column flex-1 flex">
                    <PageHeader
                        user={ user }
                        isAnonymous={ !!anonymousId }
                        unsetUser={ unsetUser }
                        title={ list.title }
                        showDate={ false }
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <ListHeader
                        userId={ user?._id }
                        setUser={ setUser }
                        anonymousId={ anonymousId }
                        members={ members }
                        setMembers={ setMembers }
                        list={ list }
                        updateList={ updateList }
                        disabledNotificationsLists={ user ? user.disabledNotificationsLists: [] }
                        setOrdering={ setOrdering }
                        appendItem={ appendItem }
                        hideCompleted={ hideCompleted }
                        setHideCompleted={ setHideCompleted }
                        displayError={ displayError }
                    />
                    <ItemsContainer
                        anonymousId={ anonymousId }
                        items={ items }
                        members={ members }
                        ordering={ ordering }
                        loading={ loading }
                        updateItem={ updateItem }
                        deleteItem={ deleteItem }
                        displayError={ displayError }
                    />
                </div>
            </div>
        </div>
    );
}

