import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useRef, useState } from "react";
import ListItem from "../../components/listItem/ListItem";

export default function SharedWithMe({ setUser, user, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [lists, setLists] = useState([]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Shared with me" } open={true}/>
            </div>
            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 h-full flex-column flex-grow-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="Shared with me"
                    showDate={ false }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <ListItem
                    setUser={ setUser }
                    lists={ lists }
                    setLists={ setLists }
                    userId={ user._id }
                    ownership={ false }
                    displayError={ displayError }
                    socket={ socket }
                    disabledNotificationsLists={ user.disabledNotificationsLists }
                />
            </div>
            <div className="w-full p-0 md:hidden"  style={{backgroundColor: "white"}} >
                <div id="myListsContainer" className="mx-0 p-0 h-full flex-column flex-1 flex"
                     style={{backgroundColor: "white"}}>
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title="Shared with me"
                        showDate={ false }
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <ListItem
                        setUser={ setUser }
                        lists={ lists }
                        setLists={ setLists }
                        userId={ user._id }
                        ownership={ false }
                        displayError={ displayError }
                        socket={ socket }
                        disabledNotificationsLists={ user.disabledNotificationsLists }
                    />
                </div>
            </div>
        </div>
    );
}
