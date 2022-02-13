import {Dialog} from "primereact/dialog";
import { DataView} from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';
import axios from "axios";
import { useEffect, useState } from "react";
import {Button} from "primereact/button";
import AddMemberDialogContent from "./AddMemberDialogContent";

export default function MembersDialog({ display, setDisplay, list, updateList, ownership, displayError }){
    const [displayAddMember, setDisplayAddMember] = useState(false);
    const [members, setMembers] = useState([]);
    useEffect(() => {
        axios.get(`/lists/${ list._id }/members/`)
             .then(
                 members => setMembers(members.data),
                 error => displayError(error.response.data.error)
             );
    }, [list, setMembers, displayError]);
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
                <div className="col-1 m-0 p-0">
                    <Avatar
                        className="custom-target-icon"
                        image={ member.profilePicturePath !== null ? member.profilePicturePath : "/static/images/default_profile_picture.jpg" }
                        size="small"
                        shape="circle"
                        alt={ member.username + "'s profile picture" }
                    />
                </div>
                <div className="col-9">
                    <h1>{ member.username }</h1>
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
            className="w-27rem m-3"
            visible={ display }
            header={ renderHeader() }
            dismissableMask={ true }
            onHide={ () => setDisplay(false) }
        >
            <Dialog
                className="w-27rem m-3"
                header="Add a member"
                visible={ displayAddMember }
                dismissableMask={ true }
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
                rows={ 10 }
                paginator={ members.length > 10 }
                alwaysShowPaginator={ false }
                emptyMessage="An error has occurred while displaying the members of this list."
            />
        </Dialog>
    );
}
