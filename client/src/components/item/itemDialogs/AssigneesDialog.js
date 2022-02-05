import {Dialog} from "primereact/dialog";
import React, { useState, useCallback, useEffect } from "react";
import { Image } from 'primereact/image';
import "./AssigneesDialog.scss";

export function AssigneesDialog({itemId, listMembers, displayDialog, setDisplayDialog}) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";

    const [assignees, setAssignees] = useState();   // assigned members
    const [members, setMembers] = useState();       // { userId, username, profilePicturePath }
    const addAssignee = useCallback(assignee => setAssignees(assignees.concat(assignee)), [assignees, setAssignees]);
    const removeAssignee = useCallback(assignee => setAssignees(assignees.filter(i => i._id !== assignee._id)), [assignees, setAssignees]);

    return (
        <Dialog header="Assign this task to..."
                visible={displayDialog}
                dismissableMask={true} closable={false}
                onHide={() => setDisplayDialog(false)}>

            {
                listMembers.map(m => {
                    return (
                        <div className="round-icon flex align-items-center flex-wrap">
                            <img
                                className="icon"
                                key={m._id}
                                src={m.profilePicturePath ? m.profilePicturePath : defaultProfilePicture}
                                style={{width: '4rem'}}/>
                            <label className="ml-2" htmlFor="icon">{m.username}</label>
                        </div>
                    )
                })
            }

        </Dialog>
    )

}