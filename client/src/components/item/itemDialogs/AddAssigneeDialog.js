import {Dialog} from "primereact/dialog";
import {DataView} from "primereact/dataview";
import {Avatar} from "primereact/avatar";

export function AddAssigneeDialog({members, assigneeTemplate, addAssignee, display, setDisplay}){

    const assigneeTemplateCustom = (member) => {
        return (
            assigneeTemplate(member, "pi-plus", ()=>console.log("add ass"))
        )
    }

    return (
        <Dialog className="w-27rem m-3"
                header="Assign to..."
                visible={ display }
                onHide={ () => setDisplay(false) }
                dismissableMask={true} closable={false} >

            <DataView
                value={ members }
                itemTemplate={assigneeTemplateCustom}
                rows={ 10 }
                paginator={ members.length > 10 }
                alwaysShowPaginator={ false }
                emptyMessage="There are no list members left to assign."
            />

        </Dialog>
    )
}