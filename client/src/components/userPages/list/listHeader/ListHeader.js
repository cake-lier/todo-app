import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import ListOptionsMenu from "../../listOptionsMenu/ListOptionsMenu";
import { Divider } from "primereact/divider";
import {useRef, useState} from "react";
import CreateItemDialog from "../itemsContainer/itemElement/createItemDialog/CreateItemDialog";

export default function ListHeader({
    userId,
    setUser,
    anonymousId,
    members,
    setMembers,
    list,
    updateList,
    disabledNotificationsLists,
    setOrdering,
    appendItem,
    hideCompleted,
    setHideCompleted,
    displayError
}) {
    const menu = useRef();
    const menuItems = [
        { label: "Name ascending", icon: "pi pi-sort-alpha-down", command: _ => setOrdering(0) },
        { label: "Name descending", icon: "pi pi-sort-alpha-up", command: _ => setOrdering(1) },
        { label: "Creation ascending", icon: "pi pi-sort-numeric-down", command: _ => setOrdering(2) },
        { label: "Creation descending", icon: "pi pi-sort-numeric-up", command: _ => setOrdering(3) },
        { label: "Due date", icon: "pi pi-calendar", command: _ => setOrdering(4) },
        { label: "Priority", icon: "pi pi-star", command: _ => setOrdering(5) }
    ];
    const [displayDialog, setDisplayDialog] = useState(false);
    return (
        <>
            <div className="grid flex-column">
                <div className="col-12 flex flex-row align-items-center m-0 p-0 pr-2 grid">
                    <div className="md:col-4 col-10 m-0 p-0 flex justify-content-start">
                        <Button
                            className="m-3"
                            label="New Item" icon="pi pi-plus"
                            onClick={() => setDisplayDialog(true)}
                        />
                        <CreateItemDialog
                            listId={ list._id }
                            anonymousId={ anonymousId }
                            appendItem={ appendItem }
                            displayDialog={ displayDialog }
                            setDisplayDialog={ setDisplayDialog }
                            displayError={ displayError }
                        />
                    </div>
                    <div className="md:col-8 col-2 m-0 p-0 flex flex-row align-items-center justify-content-end">
                        <Button
                            className="my-2 hidden md:block p-button-text only-text-button"
                            label={ (hideCompleted ? "Show" : "Hide" ) + " completed" }
                            icon="pi pi-filter"
                            onClick={ () => setHideCompleted(!hideCompleted) }
                        />
                        <Button
                            className="my-2 hidden md:block p-button-text only-text-button"
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
                <div className="col-12 md:hidden m-0 p-0 flex align-items-center justify-content-evenly">
                    <Button
                        className="my-2 p-button-text only-text-button"
                        label={ (hideCompleted ? "Show" : "Hide" ) + " completed" }
                        icon="pi pi-filter"
                        onClick={ () => setHideCompleted(!hideCompleted) }
                    />
                    <Button
                        className="my-2 p-button-text only-text-button"
                        label="Sort by"
                        icon="pi pi-sort-amount-down-alt"
                        onClick={ e => menu.current.toggle(e) }
                    />
                </div>
            </div>
            <Divider className="m-0 mb-3" />
        </>
    );
}
