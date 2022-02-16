import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useRef, useState } from "react";
import ListsItem from "../../components/listsItem/ListsItem";
import {Button} from "primereact/button";
import {Menu} from "primereact/menu";

export default function SharedWithMe({ setUser, user, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [ordering, setOrdering] = useState(null);
    const menu = useRef();
    const menuItems = [
        { label: "Name ascending", icon: "pi pi-sort-alpha-down", command: _ => setOrdering(0) },
        { label: "Name descending", icon: "pi pi-sort-alpha-up", command: _ => setOrdering(1) },
        { label: "Creation ascending", icon: "pi pi-sort-numeric-down", command: _ => setOrdering(2) },
        { label: "Creation descending", icon: "pi pi-sort-numeric-up", command: _ => setOrdering(3) }
    ];
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
                <div className="grid">
                    <div className="col-12 m-0 pl-1 flex align-content-center justify-content-end">
                        <Button
                            className="my-2"
                            id="order-button"
                            label="Sort by"
                            icon="pi pi-sort-amount-down-alt"
                            onClick={ e => menu.current.toggle(e) }
                        />
                        <Menu model={ menuItems } popup ref={ menu } />
                    </div>
                </div>
                <ListsItem
                    setUser={ setUser }
                    lists={ lists }
                    setLists={ setLists }
                    userId={ user._id }
                    ownership={ false }
                    displayError={ displayError }
                    socket={ socket }
                    disabledNotificationsLists={ user.disabledNotificationsLists }
                    ordering={ ordering }
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
                    <div className="grid">
                        <div className="col-12 m-0 pl-1 flex align-content-center justify-content-end">
                            <Button
                                className="my-2"
                                id="order-button"
                                label="Sort by"
                                icon="pi pi-sort-amount-down-alt"
                                onClick={ e => menu.current.toggle(e) }
                            />
                            <Menu model={ menuItems } popup ref={ menu } />
                        </div>
                    </div>
                    <ListsItem
                        setUser={ setUser }
                        lists={ lists }
                        setLists={ setLists }
                        userId={ user._id }
                        ownership={ false }
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
