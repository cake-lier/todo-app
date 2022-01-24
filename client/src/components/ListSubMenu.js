import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { TieredMenu } from 'primereact/tieredmenu';
import axios from "axios";
import {InputText} from "primereact/inputtext";
import JoinCodeMessage from "./JoinCodeMessage";
import {useState} from "react";

export default function ListSubMenu({data, menuRef, lists, setLists}){

    const [display, setDisplay] = useState(false);

    const openEditDialog = (data) => {

    }

    const openShareDialog = () => {
        setDisplay(true);
    }

    const deleteList = () => {
        axios.delete(
            "/lists/" + data._id
        ).then(
            result => {
                const newLists = lists.filter((list) => list._id !== data._id)
                setLists(newLists);
                console.log("DELETE");
                console.log(newLists);
            },
            error => {
                // TODO
            }
        )
    }

    const items = [
        {label: "Edit", icon: PrimeIcons.PENCIL, command: openEditDialog(data)},
        {label: "Share", icon: PrimeIcons.USER_PLUS, command: openShareDialog},
        {label: "Delete", icon: PrimeIcons.TRASH, command: deleteList}
    ]

    return(
        <div>
            <Dialog className="w-27rem m-3"
                    header="Join code"
                    visible={display}
                    onHide={() => setDisplay(false)}>
                <JoinCodeMessage joinCode={data.joinCode}/>
            </Dialog>
            <TieredMenu model={items} popup ref={menuRef} id="overlay_tmenu"/>
        </div>
    );
}