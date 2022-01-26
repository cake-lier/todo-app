import { Button } from 'primereact/button';
import {useState} from "react";
import JoinCodeMessage from "./JoinCodeMessage";
import {Dialog} from "primereact/dialog";
import JoinListMessage from "./JoinListMessage";

function JoinListHeader() {

    const [display, setDisplay] = useState(false);

    return (
        <div className="grid pb-5">
            <Dialog className="w-27rem m-3"
                    header="Join a list"
                    visible={display}
                    onHide={() => setDisplay(false)}>
                <JoinListMessage/>
            </Dialog>

            <div className="col-6 m-0 p-0 pl-1 flex align-content-center">
                <Button
                    className="p-2"
                    id="create-button"
                    label="Join list"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={() => setDisplay(true)}
                />
            </div>
            <div className="col-6 m-0 pl-1 flex align-content-center justify-content-end">
                <Button className="p-2" id="search-button" icon="pi pi-search" alt="search"/>
            </div>
        </div>
    );
}

export default JoinListHeader;