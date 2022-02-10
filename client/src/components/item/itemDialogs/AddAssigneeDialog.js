import {Dialog} from "primereact/dialog";
import {DataView} from "primereact/dataview";

export function AddAssigneeDialog({members, assigneeTemplate, addAssignee, display, setDisplay}){

    const assigneeTemplateCustom = member => assigneeTemplate(member, "pi-plus", () => addAssignee(member));

    return (
        <Dialog
            className="w-27rem m-3"
            header="Assign the item to"
            visible={ display }
            onHide={ () => setDisplay(false) }
            dismissableMask={ true }
            closable={ false }
        >
            <DataView
                value={ members }
                itemTemplate={ assigneeTemplateCustom }
                rows={ 10 }
                paginator={ members.length > 10 }
                alwaysShowPaginator={ false }
                emptyMessage="There are no list members left to assign."
            />
        </Dialog>
    );
}
