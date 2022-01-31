import {useCallback, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { PrimeIcons } from 'primereact/api';
import { DataView} from 'primereact/dataview';
import axios from "axios";
import "./ListItem.scss";
import {Dialog} from "primereact/dialog";
import JoinCodeMessage from "../listDialogs/JoinCodeMessage";
import EditListDialog from "../listDialogs/EditListDialog";
import {TieredMenu} from "primereact/tieredmenu";
import MembersDialog from "../listDialogs/MembersDialog";

export default function ListItem({lists, setLists, userId, ownership= true}) {

    const menu = useRef(null);
    const [list, setList] = useState();
    const [displayJoinCodeDialog, setDisplayJoinCodeDialog] = useState(false);
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [displayMembersDialog, setDisplayMemberDialog] = useState(false);
    const listColor = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];

    const openEditDialog = () => {
        setDisplayEditDialog(true);
    }

    const openShareDialog = () => {
        setDisplayJoinCodeDialog(true);
    }

    const openMembersDialog = () => {
        setDisplayMemberDialog(true);
    }

    const deleteList = () => {
        axios.delete(
            "/lists/" + list._id
        ).then(
            result => {
                const newLists = lists.filter((l) => l._id !== list._id)
                setLists(newLists);
                menu.current.toggle();
            },
            error => {
                // TODO
            }
        )
    }

    const leaveList = () => {
        const member = list?.members.filter(m => m.userId === userId)[0]
        console.log(member)
        console.log(member._id)
        axios.delete(
            "/lists/" + list?._id + "/members/" + member._id
        ).then(
            r => {
                const newList = lists.filter(l => l._id !== list?._id)
                setLists(newList)
                menu.current.toggle();
            }
        )
    }

    const items = [
        {label: "Edit", icon: PrimeIcons.PENCIL, command: openEditDialog},
        {label: (ownership ? "Modify members" : "Show members"), icon: PrimeIcons.USER_EDIT, command: openMembersDialog},
        {label: "Share", icon: PrimeIcons.USER_PLUS, className: (list?.joinCode ? null :"hidden"), command: openShareDialog},
        {label: "Delete", icon: PrimeIcons.TRASH, className:"red-color " + (ownership? null: "hidden"),command: deleteList},
        {label: "Leave list", icon: PrimeIcons.SIGN_OUT, className:"red-color " + (ownership? "hidden": null),command: leaveList}
    ]

    useEffect(() => {
        axios.get(
            ownership? "/lists" : "/lists/shared"
        ).then(
            lists => {
                setLists(lists.data);
            },
            error => {
                //TODO
            }
        )
    }, [setLists]);

    useEffect(() => {
        setList(list)
    }, [list]);

    const navigate = useNavigate();
    const onTitleClick = useCallback(
            (id) => navigate(`/my-lists/${id}`), [navigate])

    const renderListItem = (data) => {

        const handleClick = (e, list) => {
            menu.current.toggle(e);
            setList(list);
        }
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center list-item">
                <div className="col-11 flex align-items-center" id="list-icon">
                    <i className={"pi pi-circle-fill " + (listColor[data.colorIndex])}></i>
                    <i className="pi pi-list ml-2"></i>
                    <h1 className="ml-2 cursor-pointer" onClick={() => onTitleClick(data._id)}>{data.title}</h1>
                </div>
                <div className="col-1 flex flex-row-reverse align-items-center">
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
        <div className={"card flex flex-grow-1 " + (!lists.length? "justify-content-center align-items-center" : null)}>
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
                ownership={ownership}
            />

            <MembersDialog
                display={displayMembersDialog}
                setDisplay={setDisplayMemberDialog}
                listId={list?._id}
                lists={lists}
                setLists={setLists}
                members={list?.members}
                ownership={ownership}
            />
            <DataView
                className={!lists.length ? null : "w-full" }
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