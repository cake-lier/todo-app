import {Dialog} from "primereact/dialog";
import AddMemberDialogContent from "../../listDialogs/AddMemberDialogContent";
import {DataView} from "primereact/dataview";
import {Button} from "primereact/button";
import {useState} from "react";

export function ManageItemDialog({display, setDisplay}){
    const [displayAddMember, setDisplayAddMember] = useState(false);

    const renderHeader = () => {
        return (
            <div className="grid flex flex-row align-items-center">
                <h1>Members</h1>
                <Button
                    className={"ml-3 p-1"}
                    id="create-button"
                    label="Add"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplayAddMember(true) }
                />
            </div>
        );
    }

    return (
        <Dialog className="w-27rem m-3" visible={ display } header={ renderHeader() } onHide={ () => setDisplay(false) }>
            <Dialog className="w-27rem m-3"
                    header="Add a member"
                    visible={ displayAddMember }
                    onHide={ () => setDisplayAddMember(false) }>
                <span>This is content.</span>
            </Dialog>
            <span>This is other content.</span>
        </Dialog>
    )
}