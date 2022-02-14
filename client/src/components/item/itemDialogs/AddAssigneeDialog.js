import {Dialog} from "primereact/dialog";
import {DataView} from "primereact/dataview";
import AddAssigneeRow from "./AddAssigneeRow";
import {useCallback, useState} from "react";
import axios from "axios";

export default function AddAssigneeDialog({ item, anonymousId, members, updateItem, display, setDisplay, displayError }) {
    const [runningTotal, setRunningTotal] = useState(item.count - item.remainingCount);
    const addAssignee = useCallback((member, count) => {
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
                    setDisplay(false);
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
                    setDisplay(false);
                },
                error => displayError(error.response.data.error)
            );
        }
    }, [item, anonymousId, updateItem, displayError, setDisplay]);

    return (
        <Dialog
            className="m-3"
            header="Assign the item to"
            visible={ display }
            onHide={
                () => {
                    setDisplay(false);
                    setRunningTotal(item.count - item.remainingCount);
                }
            }
            dismissableMask={ true }
            closable={ false }
        >
            <DataView
                value={ members }
                itemTemplate={
                    member =>
                        <AddAssigneeRow
                            item={ item }
                            member={ member }
                            addAssignee={ addAssignee }
                            runningTotal={ runningTotal }
                            setRunningTotal={ setRunningTotal }
                        />
                }
                rows={ 10 }
                paginator={ members.length > 10 }
                alwaysShowPaginator={ false }
            />
        </Dialog>
    );
}
