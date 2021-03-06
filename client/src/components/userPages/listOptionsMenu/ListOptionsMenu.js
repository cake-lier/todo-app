import {Button} from "primereact/button";
import {Menu} from "primereact/menu";
import {PrimeIcons} from "primereact/api";
import axios from "axios";
import {useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import JoinCodeDialog from "./joinCodeDialog/JoinCodeDialog";
import EditListDialog from "./editListDialog/EditListDialog";
import MembersDialog from "./membersDialog/MembersDialog";

export default function ListOptionsMenu({ userId, anonymousId, members, setMembers, setUser, ownership, disabledNotificationsLists, list, lists = [], setLists = () => {}, displayError }) {
    const menu = useRef(null);
    const [displayJoinCodeDialog, setDisplayJoinCodeDialog] = useState(false);
    const [displayEditDialog, setDisplayEditDialog] = useState(false);
    const [displayMembersDialog, setDisplayMemberDialog] = useState(false);

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
                 },
                 error => displayError(error.response.data.error)
             );
    };
    const enableNotifications = () => {
        axios.put(
            "/users/me/enableListNotifications",
            { enabled: disabledNotificationsLists.includes(list._id), listId: list._id }
        ).then(
            user => setUser(user.data),
            error => displayError(error.response.data.error)
        );
    }
    const updateList = list => {
        const listIndex = lists.findIndex(l => l._id === list._id);
        const updatedLists = lists.filter(l => l._id !== list._id);
        updatedLists.splice(listIndex, 0, list);
        setLists(updatedLists);
    };

    const items = [
        { label: "Edit list", icon: PrimeIcons.PENCIL, command: openEditDialog },
        {
            label: (ownership ? "Edit members" : "Show members"),
            icon: PrimeIcons.USER_EDIT,
            command: openMembersDialog
        },
        {
            label: "Share list",
            icon: PrimeIcons.USER_PLUS,
            className: ( list?.joinCode ? null : "hidden" ),
            command: openShareDialog
        }
    ].concat(
        userId
        ? [
              {
                  label: (disabledNotificationsLists.includes(list._id) ? "Unmute notifications" : "Mute notifications"),
                  icon: (disabledNotificationsLists.includes(list._id) ? PrimeIcons.VOLUME_UP : PrimeIcons.VOLUME_OFF),
                  command: enableNotifications
              },
              {
                  label: "Delete list",
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
          ]
        : []
    );
    return (
        <>
            <Button
                icon="pi pi-ellipsis-h"
                aria-label="open list sub-menu"
                onClick={ e => menu.current.toggle(e) }
                className="p-button-rounded p-button-icon-only p-button-text three-dots text-3xl"
            />
            <Menu model={ items } popup ref={ menu } id="overlay_tmenu" />
            <Dialog
                className="w-27rem m-3 pb-5"
                header="Join code"
                visible={ displayJoinCodeDialog }
                closable={ false }
                dismissableMask={ true }
                draggable={ false }
                resizable={ false }
                onHide={ () => setDisplayJoinCodeDialog(false) }
            >
                <JoinCodeDialog joinCode={ list.joinCode } />
            </Dialog>
            <EditListDialog
                display={ displayEditDialog }
                setDisplay={ setDisplayEditDialog }
                updateList={ updateList }
                listId={ list._id }
                anonymousId={ anonymousId }
                title={ list.title }
                joinCode={ list.joinCode }
                colorIndex={ list.colorIndex }
                ownership={ ownership }
                displayError={ displayError }
            />
            <MembersDialog
                members={ members }
                setMembers={ setMembers }
                display={ displayMembersDialog }
                setDisplay={ setDisplayMemberDialog }
                list={ list }
                updateList={ updateList }
                ownership={ ownership }
                displayError={ displayError }
            />
        </>
    );
}
