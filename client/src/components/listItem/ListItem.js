import React, {useCallback, useEffect, useRef, useState} from "react";
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
import {Button} from "primereact/button";
import EmptyPlaceholder from "../EmptyPlaceholder";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function ListItem({ setUser, lists, setLists, userId, ownership = true, displayError, socket, disabledNotificationsLists }) {
    const menu = useRef(null);
    const [selectedList, setSelectedList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [displayJoinCodeDialog, setDisplayJoinCodeDialog] = useState(false);
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [displayMembersDialog, setDisplayMemberDialog] = useState(false);
    const listColor = [ "red-list", "purple-list", "blue-list", "green-list", "yellow-list" ];

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
        axios.delete("/lists/" + selectedList._id)
             .then(
                 _ => {
                     setLists(lists.filter(l => l._id !== selectedList._id));
                     menu.current.toggle();
                 },
                 error => displayError(error.response.data.error)
             );
    };
    const leaveList = () => {
        const member = selectedList.members.filter(m => m.userId === userId)[0];
        axios.delete(`/lists/${ selectedList._id }/members/${ member._id }`)
             .then(
                 _ => {
                     setLists(lists.filter(l => l._id !== selectedList._id))
                     menu.current.toggle();
                 },
                 error => displayError(error.response.data.error)
             );
    };
    const enableNotifications = () => {
        axios.put(
            "/users/me/enableListNotifications",
            { enabled: disabledNotificationsLists.includes(selectedList?._id), listId: selectedList?._id }
        ).then(
            user => {
                setUser(user.data);
                menu.current.toggle();
            },
            error => displayError(error.response.data.error)
        );
    }
    const items = [
        { label: "Edit", icon: PrimeIcons.PENCIL, command: openEditDialog },
        { label: (ownership ? "Modify members" : "Show members"), icon: PrimeIcons.USER_EDIT, command: openMembersDialog },
        { label: "Share", icon: PrimeIcons.USER_PLUS, className: ( selectedList?.joinCode ? null : "hidden" ), command: openShareDialog },
        {
            label: (disabledNotificationsLists.includes(selectedList?._id) ? "Unmute notifications" : "Mute notifications"),
            icon: (disabledNotificationsLists.includes(selectedList?._id) ? PrimeIcons.VOLUME_UP : PrimeIcons.VOLUME_OFF),
            command: enableNotifications
        },
        {
            label: "Delete",
            icon: PrimeIcons.TRASH,
            className: "red-color " + ( ownership ? null : "hidden" ),
            command: deleteList
        },
        {
            label: "Leave list",
            icon: PrimeIcons.SIGN_OUT,
            className: "red-color " + ( ownership ? "hidden" : null ),
            command: leaveList
        }
    ];
    useEffect(() => {
        axios.get(ownership ? "/lists" : "/lists?shared=true")
             .then(
                 lists => {setLists(lists.data)},
                 error => displayError(error.response.data.error)
             )
            .then(_ => setLoading(false));
    }, [ownership, setLists, displayError, setLoading]);
    useEffect(() => {
        function handleUpdates(event) {
            if ((/^list(?:Created|Deleted|(?:Title|Visibility|Color)Changed|Member(?:Added|Removed))Reload$/.test(event))
                || (/^listSelf(?:Added|Removed)Reload$/.test(event) && !ownership)) {
                axios.get(ownership ? "/lists" : "/lists?shared=true")
                     .then(
                         lists => {
                             setLists(lists.data);
                             menu.current.hide();
                             if (selectedList !== null) {
                                 const chosenList = lists.data.filter(l => l._id === selectedList._id);
                                 setSelectedList(chosenList.length > 0 ? chosenList[0] : null);
                             }
                         },
                         error => displayError(error.response.data.error)
                     );
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [ownership, displayError, socket, setLists, setSelectedList, selectedList]);
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
            setSelectedList(list);
        }
        return (
            <div className="col-12 m-0 p-0 pl-2 flex flex-row align-items-center list-item">
                <div className="col-11 flex align-items-center" id="list-icon">
                    <i className={ "pi pi-circle-fill item " + (listColor[list.colorIndex]) } />
                    <i className="pi pi-list item ml-2 pl-1" />
                    <h1 className="ml-2 cursor-pointer text-xl" onClick={ () => onTitleClick(list._id) }>{ list.title }</h1>
                </div>
                <div className="col-1 flex flex-row-reverse align-items-center">
                    <Button icon="pi pi-ellipsis-h"
                            onClick={ handleClick }
                            className="p-button-rounded p-button-icon-only p-button-text three-dots text-3xl"/>
                </div>
            </div>
        );
    };
    return (
        <div className={"card flex flex-grow-1 " + (!lists.length ? "justify-content-center align-items-center" : null) }>
            <ProgressSpinner
                className={loading? null : "hidden"}
                style={{width: '50px', height: '50px'}}
                strokeWidth="2"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            <Dialog className="w-27rem m-3"
                    header="Join code"
                    visible={ displayJoinCodeDialog }
                    onHide={ () => setDisplayJoinCodeDialog(false) }>
                { selectedList !== null ? <JoinCodeMessage joinCode={selectedList.joinCode} /> : null }
            </Dialog>
            <TieredMenu model={ items } popup ref={ menu } id="overlay_tmenu"/>
            { selectedList !== null
                ? <>
                      <EditListDialog
                          display={displayEditDialog}
                          setDisplay={setDisplayEditDialog}
                          updateList={ updateList }
                          listId={selectedList._id}
                          title={selectedList.title}
                          joinCode={selectedList.joinCode}
                          colorIndex={selectedList.colorIndex}
                          ownership={ownership}
                          displayError={displayError}
                      />
                      <MembersDialog
                          display={ displayMembersDialog }
                          setDisplay={ setDisplayMemberDialog }
                          list={ selectedList }
                          updateList={ updateList }
                          ownership={ ownership }
                          displayError={ displayError }
                      />
                  </>
                : null
            }
            <DataView
                className={ !loading && lists.length ? "w-full" : "hidden"}
                value={ lists }
                layout="list"
                itemTemplate={ itemTemplate }
                rows={ 10 }
                paginator={ lists.length > 10 }
                alwaysShowPaginator={ false }
            />
            <div className={ ( !loading && !lists.length ? null : "hidden") }>
                <EmptyPlaceholder
                    title="No lists to display"
                    subtitle={ ownership ? "Create a list and start organizing your days!" : "Lists which you are member of will show up here."}
                    type={"lists"}
                />
            </div>
        </div>
    );
}
