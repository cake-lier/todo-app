import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useRef, useState } from "react";
import ListItem from "../../components/listItem/ListItem";
import {Divider} from "primereact/divider";
import SharedWithMeHeader from "../../components/SharedWithMeHeader";

export default function SharedWithMe({ setUser, user, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const node = useRef();
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    };
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
                <SharedWithMeHeader />
                <Divider className="p-0" />
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
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "Shared with me" } open={open}/>
                    </div>
                </div>
                <div id="myListsContainer" className="mx-0 p-0 h-full flex-column flex-grow-1 md:flex"
                     style={{backgroundColor: "white"}}>
                    <div className={"black-overlay absolute h-full w-full z-20 " + (open ? null : "hidden")} />
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
                    <SharedWithMeHeader />
                    <Divider className="p-0" />
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
