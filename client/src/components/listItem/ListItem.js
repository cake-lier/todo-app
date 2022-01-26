import {useEffect, useRef, useState} from "react";
import { PrimeIcons } from 'primereact/api';
import { DataView} from 'primereact/dataview';
import axios from "axios";
import "./ListItem.scss";
import {Dialog} from "primereact/dialog";
import JoinCodeMessage from "../JoinCodeMessage";
import EditListDialog from "../listDialogs/EditListDialog";
import {TieredMenu} from "primereact/tieredmenu";

export default function ListItem({lists, setLists, ownership}) {

    const menu = useRef(null);
    const [list, setList] = useState();
    const [displayJoinCodeDialog, setDisplayJoinCodeDialog] = useState(false);
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const listColor = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];

    const openEditDialog = () => {
        setDisplayEditDialog(true);
    }

    const openShareDialog = () => {
        setDisplayJoinCodeDialog(true);
    }

    const deleteList = () => {
        axios.delete(
            "/lists/" + list._id
        ).then(
            result => {
                const newLists = lists.filter((l) => l._id !== list._id)
                setLists(newLists);
                menu.current.toggle();
                console.log("DELETE");
                console.log(newLists);
            },
            error => {
                // TODO
            }
        )
    }
    const items = [
        {label: "Edit", icon: PrimeIcons.PENCIL, command: openEditDialog},
        {label: "Share", icon: PrimeIcons.USER_PLUS, command: openShareDialog},
        {label: "Delete", icon: PrimeIcons.TRASH, command: deleteList}
    ]

    useEffect(() => {
        axios.get(
            ownership ? "/lists" : "/lists/shared"
        ).then(
            lists => {
                setLists(lists.data);
                console.log(lists.data);
            },
            error => {
                //TODO
            }
        )
    }, [setLists]);

    useEffect(() => {
        setList(list)
    }, [list]);

    const renderListItem = (data) => {

        const handleClick = (e, list) => {
            menu.current.toggle(e);
            setList(list);
            console.log("SELECTED")
            console.log(list)
        }
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center list-item" key={data._id}>
                <div className="col-6 flex align-items-center" id="list-icon">
                    <i className={"pi pi-circle-fill " + (listColor[data.colorIndex])}></i>
                    <i className="pi pi-list ml-2"></i>
                    <h1 className="ml-2">{data.title}</h1>
                </div>
                <div className="col-6 flex flex-row-reverse align-items-center">
                    <i className="pi pi-ellipsis-h mr-2" onClick={(e) => handleClick(e, data)}></i>
                </div>
            </div>
        );
    }

    const itemTemplate = (list) => {
        if (!list) {
            return;
        }

        return renderListItem(list);
    }


    return (
        <div className="card">
            <Dialog className="w-27rem m-3"
                    header="Join code"
                    visible={displayJoinCodeDialog}
                    onHide={() => setDisplayJoinCodeDialog(false)}>
                {<JoinCodeMessage joinCode={list?.joinCode}/>}
            </Dialog>

            <TieredMenu model={items} popup ref={menu} id="overlay_tmenu"/>

            <EditListDialog
                display={displayEditDialog}
                setDisplay={setDisplayEditDialog}
                lists={lists}
                setLists={setLists}
                listId={list?._id}
                title={list?.title}
                joinCode={list?.joinCode}
                colorIndex={list?.colorIndex}
                listMembers={list?.members}
            />
            <DataView
                value={lists}
                layout="list"
                itemTemplate={itemTemplate}
                rows={10}
                paginator={lists.length > 10}
                alwaysShowPaginator={false}
                emptyMessage="No list to display."
            />
        </div>
    );
}