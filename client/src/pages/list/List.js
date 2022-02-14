import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import JoinDialog from "../../components/joinDialog/JoinDialog";
import ItemsContainer from "../../components/item/itemsContainer/ItemsContainer";

export default function List({ user, anonymousId, setUser, unsetUser, notifications, setNotifications, socket }) {
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
                if (new RegExp("^list(?:titleChanged|Member(?:Added|Removed))Reload$").test(event)) {
                    getHeader();
                } else if (new RegExp("^list(?:Deleted|SelfRemoved)Reload$").test(event)) {
                    navigate("/my-day");
                }
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [id, socket, getHeader, navigate]);
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
                      <MainMenu selected={ null } />
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
                <ItemsContainer
                    userId={ user?._id }
                    anonymousId={ anonymousId }
                    setUser={ setUser }
                    list={ list }
                    setList={ setList }
                    disabledNotificationsLists={ user ? user.disabledNotificationsLists: [] }
                    socket={ socket }
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
                    <ItemsContainer
                        userId={ user?._id }
                        anonymousId={ anonymousId }
                        setUser={ setUser }
                        list={ list }
                        setList={ setList }
                        disabledNotificationsLists={ user ? user.disabledNotificationsLists: [] }
                        socket={ socket }
                        displayError={ displayError }
                    />
                </div>
            </div>
        </div>
    );
}

