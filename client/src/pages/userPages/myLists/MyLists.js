import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import { useCallback, useRef, useState } from "react";
import MyListsHeader from "../../../components/userPages/myLists/myListsHeader/MyListsHeader";
import ListsContainer from "../../../components/userPages/listsContainer/ListsContainer";
import "./MyLists.scss";

export default function MyLists({ user, setUser, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [ordering, setOrdering] = useState(null);
    const [lists, setLists] = useState([]);
    const appendList = useCallback(list => setLists(lists.concat(list)), [lists, setLists]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <SideMenu selected={ "My lists" } open={ true } />
            </div>
            <div
                id="myListsContainer"
                style={{ backgroundColor: "white" }}
                className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex"
            >
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="My Lists"
                    showDate={ false }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <MyListsHeader appendList={ appendList } displayError={ displayError } setOrdering={ setOrdering } />
                <ListsContainer
                    setUser={ setUser }
                    lists={ lists }
                    setLists={ setLists }
                    userId={ user._id }
                    displayError={ displayError }
                    socket={ socket }
                    disabledNotificationsLists={ user.disabledNotificationsLists }
                    ordering={ ordering }
                />
            </div>
            <div className="w-full p-0 md:hidden" style={{ backgroundColor: "white" }} >
                <div id="myListsContainerMobile" className="mx-0 p-0 h-full flex-column flex-1 flex"
                     style={{ backgroundColor: "white" }}>
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title="My Lists"
                        showDate={ false }
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <MyListsHeader appendList={ appendList } displayError={ displayError } setOrdering={ setOrdering } />
                    <ListsContainer
                        setUser={ setUser }
                        lists={ lists }
                        setLists={ setLists }
                        userId={ user._id }
                        displayError={ displayError }
                        socket={ socket }
                        disabledNotificationsLists={ user.disabledNotificationsLists }
                        ordering={ ordering }
                    />
                </div>
            </div>
        </div>
    );
}
