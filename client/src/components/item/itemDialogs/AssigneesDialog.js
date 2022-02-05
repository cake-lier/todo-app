import React, { useState, useCallback } from "react";
import { Avatar } from 'primereact/avatar';
import {DataView} from "primereact/dataview";
import {Dialog} from "primereact/dialog";
import {ManageItemDialog} from "./ManageItemDialog";

export function AssigneesDialog({itemId, listMembers, display, setDisplay}) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";

    const [addDialog, setAddDialog] = useState(false);

    const [assignees, setAssignees] = useState();   // assigned members
    const [members, setMembers] = useState();       // { userId, username, profilePicturePath }
    const addAssignee = useCallback(assignee => setAssignees(assignees.concat(assignee)), [assignees, setAssignees]);
    const removeAssignee = useCallback(assignee => setAssignees(assignees.filter(i => i._id !== assignee._id)), [assignees, setAssignees]);

    const iconTemplate = (member) => {
        return (
            <div className="col-12 flex flex-row justify-content-between">
                <div className="flex align-items-center mb-2" >
                    <Avatar
                        size='large'
                        className={'p-avatar-circle avatar-assignee' + member._id}
                        image={member.profilePicturePath ? member.profilePicturePath : defaultProfilePicture}
                        alt={ member.username + "'s profile picture" }
                    />
                    <label
                        htmlFor={'avatar-assignee' + member._id}
                        className="ml-2">
                        {member.username}
                    </label>
                </div>
                <div className="flex align-items-center  mb-2">
                    <i
                        className={"pi pi-times cursor-pointer mr-1"}
                        onClick={ () => console.log("remove assignee") }
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <ManageItemDialog
                title="This task is assigned to..."
                display={display}
                setDisplay={setDisplay}
                setAddDialog={setAddDialog}>
                <DataView
                    value={ listMembers }
                    itemTemplate={ iconTemplate }
                    rows={ 10 }
                    paginator={ listMembers.length > 10 }
                    alwaysShowPaginator={ false }
                    emptyMessage="There are no list members."
                />
            </ManageItemDialog>

            <Dialog className="w-27rem m-3"
                    header="Assign to..."
                    visible={ addDialog }
                    onHide={ () => setAddDialog(false) }>
                <span>This is content.</span>
            </Dialog>
        </>
    )

}