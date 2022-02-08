import { Button } from 'primereact/button';
import "./MyListsHeader.scss";
import {useState} from "react";
import CreateListDialog from "../listDialogs/CreateListDialog";

export default function MyListsHeader({ appendList, displayError }) {
    const [display, setDisplay] = useState(false);
    return (
        <div className="grid">
            <CreateListDialog
                display={ display }
                setDisplay={ setDisplay }
                appendList={ appendList }
                displayError={ displayError }
            />
            <div className="col-6 flex align-content-center">
                <Button
                    className="m-2"
                    id="create-button"
                    label="Add new list"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={ () => setDisplay(true) }
                />
            </div>
            <div className="col-6 m-0 pl-1 flex align-content-center justify-content-end">
                <Button className="py-0" id="search-button" icon="pi pi-search" alt="search"/>
            </div>
        </div>
    );
}
