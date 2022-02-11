import { useState, useCallback } from "react";
import { Avatar } from 'primereact/avatar';
import {DataView} from "primereact/dataview";
import AddAssigneeDialog from "./AddAssigneeDialog";
import axios from "axios";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";

export default function AssigneesDialog({ itemId, listMembers, display, setDisplay, setAssignees, assignees, displayError }) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";
    const [displayAddAssignee, setDisplayAddAssignee] = useState(false);
    const addAssignee = useCallback((member, count) => {
        axios.post(`/items/${ itemId }/assignees/${ member._id }`, { count })
             .then(
                 assignees => setAssignees(assignees.data),
                 error => displayError(error.response.data.error)
             );
    }, [itemId, setAssignees, displayError]);
    const removeAssignee = useCallback(assignee => {
        axios.delete(`/items/${ itemId }/assignees/${ assignee._id }`)
             .then(
                 assignees => setAssignees(assignees.data),
                 error => displayError(error.response.data.error)
            );
    }, [itemId, setAssignees, displayError]);
    const assigneeTemplate = assignee => {
        return (
            <div className="col-12 flex flex-row justify-content-between">
                <div className="flex align-items-center mb-2" >
                    <Avatar
                        size='large'
                        className="p-avatar-circle"
                        image={ assignee.profilePicturePath ? assignee.profilePicturePath : defaultProfilePicture }
                        alt={ assignee.username + "'s profile picture" }
                    />
                    <p className="ml-2">{ assignee.username }</p>
                    <p className="ml-2">x{ assignee.count }</p>
                </div>
                <div className="flex align-items-center  mb-2">
                    <i
                        className="pi pi-times cursor-pointer mr-1"
                        onClick={ () => removeAssignee(assignee) }
                    />
                </div>
            </div>
        );
    };
    const renderHeader = () => {
        return (
            <div className="grid flex flex-row align-items-center">
                <h1>This task is assigned to...</h1>
                <Button
                    className={"ml-3 p-1"}
                    id="create-button"
                    label="Add"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplayAddAssignee(true) }
                />
            </div>
        );
    };
    return (
        <>
            <Dialog
                className="w-27rem m-3"
                visible={ display }
                dismissableMask={ true }
                closable={ false }
                header={ renderHeader() }
                onHide={ () => setDisplay(false) }>
                <DataView
                    value={ assignees }
                    itemTemplate={ assigneeTemplate }
                    rows={ 10 }
                    paginator={ assignees.length > 10 }
                    alwaysShowPaginator={ false }
                    emptyMessage="There is no one assigned to this task."
                />
            </Dialog>
            <AddAssigneeDialog
                members={ listMembers }
                addAssignee={ addAssignee }
                display={ displayAddAssignee }
                setDisplay={ setDisplayAddAssignee }
            />
        </>
    );
}
