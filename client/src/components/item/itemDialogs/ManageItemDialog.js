import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

export function ManageItemDialog(props){

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
                    onClick={ () => props.setAddDialog(true) }
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
            {props.children}
        </Dialog>
    )
}