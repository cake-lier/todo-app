import {Avatar} from "primereact/avatar";
import React from "react";

export function AssigneeTag({assignee}){
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";

    return (
        <Avatar
            size='small'
            className={'p-avatar-circle avatar-assignee' + assignee._id}
            image={assignee.profilePicturePath ? assignee.profilePicturePath : defaultProfilePicture}
            alt={ assignee._id + "'s profile picture" }
        />
    )
}