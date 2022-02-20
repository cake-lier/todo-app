import {Dialog} from "primereact/dialog";
import {DataView} from "primereact/dataview";
import UpdateAssigneeRow from "./UpdateAssigneeRow";
import {useCallback, useState} from "react";
import axios from "axios";

export default function UpdateAssigneeDialog({ item, anonymousId, members, updateItem, display, setDisplay, displayError }) {
    const [assigneeSelectedId, setAssigneeSelectedId] = useState("");
    const updateAssignee = useCallback((member, count) => {
        const assignee = item.assignees.filter(a => a.memberId === member._id)?.[0];
        if (assignee === undefined) {
            axios.post(
                `/items/${ item._id }/assignees`,
                { memberId: member._id, count },
                { params: anonymousId !== null ? { anonymousId } : {} }
            )
            .then(
                item => {
                    updateItem(item.data);
                    setAssigneeSelectedId("");
                },
                error => displayError(error.response.data.error)
            );
        } else {
            axios.put(
                `/items/${ item._id }/assignees/${ assignee._id }`,
                { count },
                { params: anonymousId !== null ? { anonymousId } : {} }
            )
            .then(
                item => {
                    updateItem(item.data);
                    setAssigneeSelectedId("");
                },
                error => displayError(error.response.data.error)
            );
        }
    }, [item, anonymousId, updateItem, displayError]);

    return (
        <Dialog
            className={"md:w-8 m-3 pb-6 " + (members.length > 3 ? " h-20rem" : null )}
            header="Assign the item to"
            visible={ display }
            onHide={ () => setDisplay(false) }
            dismissableMask={ true }
            draggable={ false }
            resizable={ false }
            closable={ false }
        >
            <DataView
                value={ members }
                itemTemplate={
                    member =>
                        <UpdateAssigneeRow
                            item={ item }
                            member={ member }
                            updateAssignee={ updateAssignee }
                            assigneeSelectedId={ assigneeSelectedId }
                            setAssigneeSelectedId={ setAssigneeSelectedId }
                        />
                }
                alwaysShowPaginator={ false }
            />
        </Dialog>
    );
}
