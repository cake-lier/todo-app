import React, { useState, useCallback } from "react";
import { Avatar } from 'primereact/avatar';
import {DataView} from "primereact/dataview";
import {ManageItemDialog} from "./ManageItemDialog";
import {AddAssigneeDialog} from "./AddAssigneeDialog";
import axios from "axios";

export function AssigneesDialog({itemId, listMembers, display, setDisplay, assignees, setAssignees}) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";

    const [addDialog, setAddDialog] = useState(false);

    const addAssignee = useCallback(member => {
        axios.post( // TODO post new assignee not working
            "/items/" + itemId + "/assignees",
            {
                userId: member._id,
                anonymousId: null,
                isAnonymous: false,
                count: 1 // TODO assignee count
            }
        ).then(assignee => {
                console.log("posted new assignee");
                setAssignees(assignees.concat(assignee.data));
            },
            // TODO error msg
        );
    }, [assignees, setAssignees]);

    const removeAssignee = useCallback(assignee => {
        setAssignees(assignees.filter(i => i._id !== assignee._id));
        // TODO delete assignee
        axios.delete("/items/" + itemId + "/assignees/" + (assignee.userId !== null ? assignee.userId : assignee.anonymousId))
            .then(r => {
                    console.log("removed assignee");
                    console.log(assignees);
                },
                // TODO error msg
            )
    }, [assignees, setAssignees]);

    const assigneeTemplate = (member, icon, onClickAction) => {
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
                        className={"pi " + icon + " cursor-pointer mr-1"}
                        onClick={ onClickAction }
                    />
                </div>
            </div>
        )
    }

    const assigneeTemplateCustom = (member) => {
        return (
            assigneeTemplate(member, "pi-times", () => removeAssignee(member))
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
                    value={ assignees }
                    itemTemplate={assigneeTemplateCustom}
                    rows={ 10 }
                    paginator={ assignees.length > 10 }
                    alwaysShowPaginator={ false }
                    emptyMessage="There is no one assigned to this task."
                />
            </ManageItemDialog>
            <AddAssigneeDialog
                members={listMembers.filter(x => !assignees.includes(x))}
                assigneeTemplate={assigneeTemplate}
                addAssignee={addAssignee}
                display={addDialog}
                setDisplay={setAddDialog} />
        </>
    )

}