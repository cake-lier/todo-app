import {Dialog} from "primereact/dialog";
import { DataView} from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';
import axios from "axios";
import { useState } from "react";
import {Button} from "primereact/button";
import AddMemberDialogContent from "./AddMemberDialogContent";

export default function MembersDialog({ members, setMembers, display, setDisplay, list, updateList, ownership, displayError }){
    const [displayAddMember, setDisplayAddMember] = useState(false);
    const removeMember = member => {
        axios.delete(`/lists/${ list._id }/members/${ member._id }`)
             .then(
                list => {
                    axios.get(`/lists/${ list.data._id }/members/`)
                         .then(
                             members => setMembers(members.data),
                             error => displayError(error.response.data.error)
                         );
                    updateList(list.data);
                },
                error => displayError(error.response.data.error)
            );
    }
    const renderHeader = () => {
        return (
            <div className="grid flex flex-row align-items-center">
                <h1>Members</h1>
                <Button
                    className={"ml-3 p-2" + (ownership ? "" : " hidden")}
                    id="create-button"
                    label="Add"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplayAddMember(true) }
                />
            </div>
        );
    }
    const iconTemplate = member => {
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center">
                <div className="col-10 m-0 p-0 flex flex-row align-items-center">
                    <Avatar
                        className="custom-target-icon"
                        image={ member.profilePicturePath !== null ? member.profilePicturePath : "/static/images/default_profile_picture.jpg" }
                        size="small"
                        shape="circle"
                        alt={ member.username + "'s profile picture" }
                    />
                    <h1 className="px-1">{ member.username }</h1>
                </div>
                <div className="col-2 flex justify-content-end">
                    <h1 className={(member.role === "owner") ? null : "hidden"}>Admin</h1>
                    <i
                        className={"pi pi-times cursor-pointer mr-1 " + ((member.role !== "owner" && ownership) ? "" : "hidden")}
                        onClick={ () => removeMember(member) }
                    />
                </div>
            </div>
        );
    }
    return (
        <Dialog
            className="w-27rem h-20rem m-3"
            visible={ display }
            header={ renderHeader() }
            footer={<div className="grid"><br/><br/></div>}
            dismissableMask={ true }
            draggable={ false }
            resizable={ false }
            closable={ false }
            onHide={ () => setDisplay(false) }
        >
            <Dialog
                className="w-27rem m-3"
                header="Add a member"
                visible={ displayAddMember }
                footer={<div className="grid"><br/></div>}
                closable={ false }
                dismissableMask={ true }
                draggable={ false }
                resizable={ false }
                onHide={ () => setDisplayAddMember(false) }
            >
                <AddMemberDialogContent
                    list={ list }
                    setDisplay={ setDisplayAddMember }
                    updateList={ updateList }
                    setMembers={ setMembers }
                    displayError={ displayError }
                />
            </Dialog>
            <DataView
                value={ members }
                itemTemplate={ iconTemplate }
                emptyMessage="An error has occurred while displaying the members of this list."
            />
        </Dialog>
    );
}
