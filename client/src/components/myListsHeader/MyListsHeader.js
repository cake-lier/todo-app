import { Button } from 'primereact/button';
import "./MyListsHeader.scss";
import {useRef, useState} from "react";
import CreateListDialog from "../listDialogs/CreateListDialog";
import {Menu} from "primereact/menu";

export default function MyListsHeader({ appendList, setOrdering, displayError }) {
    const [display, setDisplay] = useState(false);
    const menu = useRef();
    const menuItems = [
        { label: "Name ascending", icon: "pi pi-sort-alpha-down", command: _ => setOrdering(0) },
        { label: "Name descending", icon: "pi pi-sort-alpha-up", command: _ => setOrdering(1) },
        { label: "Creation ascending", icon: "pi pi-sort-numeric-down", command: _ => setOrdering(2) },
        { label: "Creation descending", icon: "pi pi-sort-numeric-up", command: _ => setOrdering(3) }
    ];
    return (
        <div className="grid">
            <CreateListDialog
                display={ display }
                setDisplay={ setDisplay }
                appendList={ appendList }
                displayError={ displayError }
            />
            <div className="col-6 flex align-content-center">
                <Button
                    className="m-2"
                    id="create-button"
                    label="Add new list"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplay(true) }
                />
            </div>
            <div className="col-6 m-0 pl-1 flex align-content-center justify-content-end">
                <Button
                    id="header-secondary-button"
                    className="py-0"
                    label="Sort by"
                    icon="pi pi-sort-amount-down-alt"
                    onClick={ e => menu.current.toggle(e) }
                />
                <Menu model={ menuItems } popup ref={ menu } />
            </div>
        </div>
    );
}
