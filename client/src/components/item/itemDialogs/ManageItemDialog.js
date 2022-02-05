import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {useState} from "react";

export function ManageItemDialog(props){
    const [displayAssignTo, setDisplayAssignTo] = useState(false);

    const renderHeader = () => {
        return (
            <div className="grid flex flex-row align-items-center">
                <h1>{props.title}</h1>
                <Button
                    className={"ml-3 p-1"}
                    id="create-button"
                    label="Add"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplayAssignTo(true) }
                />
            </div>
        );
    }

    return (
        <Dialog className="w-27rem m-3"
                visible={ props.display }
                dismissableMask={true} closable={false}
                header={ renderHeader() }
                onHide={ () => props.setDisplay(false) }>
            <Dialog className="w-27rem m-3"
                    header="Assign to..."
                    visible={ displayAssignTo }
                    onHide={ () => setDisplayAssignTo(false) }>
                <span>This is content.</span>
            </Dialog>
            {props.children}
        </Dialog>
    )
}