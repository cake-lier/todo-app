import {Dialog} from "primereact/dialog";
import {DataView} from "primereact/dataview";
import AddAssigneeRow from "./AddAssigneeRow";

export default function AddAssigneeDialog({ members, addAssignee, display, setDisplay }) {
    return (
        <Dialog
            className="m-3"
            header="Assign the item to"
            visible={ display }
            onHide={ () => setDisplay(false) }
            dismissableMask={ true }
            closable={ false }
        >
            <DataView
                value={ members }
                itemTemplate={ member => <AddAssigneeRow member={ member } addAssignee={ addAssignee } /> }
                rows={ 10 }
                paginator={ members.length > 10 }
                alwaysShowPaginator={ false }
            />
        </Dialog>
    );
}
