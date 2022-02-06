import {useCallback, useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { PrimeIcons } from 'primereact/api';
import { DataView } from 'primereact/dataview';
import axios from "axios";
import "./ListItem.scss";
import { Dialog } from "primereact/dialog";
import JoinCodeMessage from "../listDialogs/JoinCodeMessage";
import EditListDialog from "../listDialogs/EditListDialog";
import { TieredMenu } from "primereact/tieredmenu";
import MembersDialog from "../listDialogs/MembersDialog";

export default function ListItem({ setUser, lists, setLists, userId, ownership= true, displayError, socket, disabledListNotification }) {
    const menu = useRef(null);
    const [list, setList] = useState(null);
    const [displayJoinCodeDialog, setDisplayJoinCodeDialog] = useState(false);
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [displayMembersDialog, setDisplayMemberDialog] = useState(false);
    const [listNotification, setListNotification] = useState(disabledListNotification);
    const listColor = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];

    const openEditDialog = () => {
        setDisplayEditDialog(true);
    };
    const openShareDialog = () => {
        setDisplayJoinCodeDialog(true);
    };
    const openMembersDialog = () => {
        setDisplayMemberDialog(true);
    };
    const deleteList = () => {
        axios.delete("/lists/" + list._id)
             .then(
                 _ => {
                     setLists(lists.filter(l => l._id !== list._id));
                     menu.current.toggle();
                 },
                 error => displayError(error.response.data.error)
             );
    };
    const leaveList = () => {
        const member = list.members.filter(m => m.userId === userId)[0];
        axios.delete(`/lists/${ list._id }/members/${ member._id }`)
             .then(
                 _ => {
                     setLists(lists.filter(l => l._id !== list._id))
                     menu.current.toggle();
                 },
                 error => displayError(error.response.data.error)
             );
    };
    const enableNotification = () => {
        axios.put(
            "/users/me/enableListNotifications",
            {enabled: listNotification.includes(list?._id), listId: list?._id}
        ).then(
            user => {
                setListNotification(user.data.disabledListNotification);
                setUser(user.data)
                menu.current.toggle();
            },
            error => displayError(error)
        )
    }
    const items = [
        { label: "Edit", icon: PrimeIcons.PENCIL, command: openEditDialog },
        { label: (ownership ? "Modify members" : "Show members"), icon: PrimeIcons.USER_EDIT, command: openMembersDialog },
        { label: "Share", icon: PrimeIcons.USER_PLUS, className: ( list?.joinCode ? null : "hidden" ), command: openShareDialog },
        {
            label: (listNotification.includes(list?._id) ? "Unmute notifications" : "Mute notifications"),
            icon: (listNotification.includes(list?._id) ? PrimeIcons.VOLUME_UP : PrimeIcons.VOLUME_OFF),
            command:enableNotification
        },
        { label: "Delete", icon: PrimeIcons.TRASH, className: "red-color " + ( ownership ? null: "hidden" ), command: deleteList },
        { label: "Leave list", icon: PrimeIcons.SIGN_OUT, className: "red-color " + ( ownership ? "hidden" : null ), command: leaveList }
    ];
    useEffect(() => {
        axios.get(ownership ? "/lists" : "/lists?shared=true")
             .then(
                 lists => setLists(lists.data),
                 error => displayError(error.response.data.error)
             );
    }, [ownership, setLists, displayError]);
    useEffect(() => {
        function handleUpdates(event) {
            if ([
                "listCreated",
                "listDeleted",
                "listTitleChanged",
                "listVisibilityChanged",
                "listMemberAdded",
                "listSelfRemoved",
                "listMemberRemoved"
            ].includes(event)) {
                axios.get(ownership ? "/lists" : "/lists?shared=true")
                     .then(
                         lists => {
                             setLists(lists.data);
                             menu.current.hide();
                             if (list !== null) {
                                 const chosenList = lists.data.filter(l => l._id === list._id);
                                 setList(chosenList.length > 0 ? chosenList[0] : null);
                             }
                         },
                         error => displayError(error.response.data.error)
                     );
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [ownership, displayError, socket, setLists, setList, list]);
    const navigate = useNavigate();
    const onTitleClick = useCallback(id => navigate(`/my-lists/${ id }`), [navigate]);
    const updateList = list => {
        const listIndex = lists.findIndex(l => l._id === list._id);
        const updatedLists = lists.filter(l => l._id !== list._id);
        updatedLists.splice(listIndex, 0, list);
        setLists(updatedLists);
    };
    const itemTemplate = list => {
        if (!list) {
            return;
        }
        const handleClick = e => {
            menu.current.toggle(e);
            setList(list);
        }
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center list-item">
                <div className="col-11 flex align-items-center" id="list-icon">
                    <i className={ "pi pi-circle-fill " + (listColor[list.colorIndex]) } />
                    <i className="pi pi-list ml-2" />
                    <h1 className="ml-2 cursor-pointer" onClick={ () => onTitleClick(list._id) }>{ list.title }</h1>
                </div>
                <div className="col-1 flex flex-row-reverse align-items-center">
                    <i className="pi pi-ellipsis-h mr-2 cursor-pointer" onClick={ handleClick } />
                </div>
            </div>
        );
    };
    return (
        <div className={"card flex flex-grow-1 " + (!lists.length ? "justify-content-center align-items-center" : null) }>
            <Dialog className="w-27rem m-3"
                    header="Join code"
                    visible={ displayJoinCodeDialog }
                    onHide={ () => setDisplayJoinCodeDialog(false) }>
                { list !== null ? <JoinCodeMessage joinCode={list.joinCode} /> : null }
            </Dialog>
            <TieredMenu model={ items } popup ref={ menu } id="overlay_tmenu"/>
            { list !== null
                ? <>
                      <EditListDialog
                          display={displayEditDialog}
                          setDisplay={setDisplayEditDialog}
                          updateList={ updateList }
                          listId={list._id}
                          title={list.title}
                          joinCode={list.joinCode}
                          colorIndex={list.colorIndex}
                          ownership={ownership}
                          displayError={displayError}
                      />
                      <MembersDialog
                          display={ displayMembersDialog }
                          setDisplay={ setDisplayMemberDialog }
                          list={ list }
                          updateList={ updateList }
                          ownership={ ownership }
                          displayError={ displayError }
                      />
                  </>
                : null
            }
            <DataView
                className={ !lists.length ? "" : "w-full" }
                value={ lists }
                layout="list"
                itemTemplate={ itemTemplate }
                rows={ 10 }
                paginator={ lists.length > 10 }
                alwaysShowPaginator={ false }
                emptyMessage="No list to display."
            />
        </div>
    );
}
