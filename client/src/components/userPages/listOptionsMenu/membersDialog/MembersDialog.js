import {Dialog} from "primereact/dialog";
import { DataView } from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';
import axios from "axios";
import { useState } from "react";
import {Button} from "primereact/button";
import AddMemberDialog from "../addMemberDialog/AddMemberDialog";

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
            <div className="col-12 m-0 p-0 my-1 flex flex-row align-items-center">
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
            className={"w-27rem m-3 pb-5 " + (members.length > 4 ? " h-25rem" : null )}
            visible={ display }
            header={ renderHeader() }
            dismissableMask={ true }
            draggable={ false }
            resizable={ false }
            closable={ false }
            onHide={ () => setDisplay(false) }
        >
            <AddMemberDialog
                list={ list }
                display={ displayAddMember }
                setDisplay={ setDisplayAddMember }
                updateList={ updateList }
                setMembers={ setMembers }
                displayError={ displayError }
            />
            <DataView
                value={ members }
                itemTemplate={ iconTemplate }
                emptyMessage="An error has occurred while displaying the members of this list."
            />
        </Dialog>
    );
}
