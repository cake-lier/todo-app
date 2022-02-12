import { Chip } from "primereact/chip";
import axios from "axios";
import {useCallback} from "react";

export default function ChipAssignee({ itemId, assignee, updateItem, displayError, isRemovable }){
    const onRemove = useCallback(() => {
        axios.delete(`/items/${ itemId }/assignees/${ assignee._id }`)
            .then(
                item => updateItem(item.data),
                error => displayError(error.response.data.error)
            );
    }, [itemId, updateItem, displayError, assignee]);
    return (
        <Chip
            label={ assignee.username + " x" + assignee.count }
            className="mr-1 mb-1"
            image={
                assignee.profilePicturePath
                ? assignee.profilePicturePath
                : "/static/images/default_profile_picture.jpg"
            }
            removable={ isRemovable }
            onRemove={ onRemove }
        />
    );
}
