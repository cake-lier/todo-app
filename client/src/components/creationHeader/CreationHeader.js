import { Button } from 'primereact/button';
import "./CreationHeader.scss";
import {useState} from "react";

function CreationHeader({title}, props) {

    return (
        <div className="grid">
            <div className="col-6 m-0 pl-1 flex align-content-center">
                <Button className="p-2" id="create-button" label={title} icon="pi pi-plus" iconPos="left" />
            </div>
            <div className="col-6 m-0 pl-1 flex align-content-center justify-content-end">
                <Button className="p-2" id="search-button" icon="pi pi-search" alt="search"/>
            </div>
        </div>
    );
}

export default CreationHeader;