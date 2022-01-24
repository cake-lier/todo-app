import {useEffect, useRef, useState} from "react";
import { DataView} from 'primereact/dataview';
import axios from "axios";
import "./ListItem.scss";
import ListSubMenu from "../ListSubMenu";

export default function ListItem({lists, setLists}) {

    const menu = useRef(null);
    const [paginator, setPaginator] = useState(false);
    const listColor = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];

    useEffect(() => {
        axios.get(
            "/lists"
        ).then(
            lists => {
                setLists(lists.data);
                if (lists.data.length > 0) setPaginator(true);
                console.log(lists.data);
            },
            error => {
                //TODO
            }
        )
    }, [setLists]);

    const renderListItem = (data) => {
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center list-item">
                <div className="col-6 flex align-items-center" id="list-icon">
                    <i className={"pi pi-circle-fill " + (listColor[data.colorIndex])}></i>
                    <i className="pi pi-list ml-2"></i>
                    <h1 className="ml-2">{data.title}</h1>
                </div>
                <div className="col-6 flex flex-row-reverse align-items-center">
                    <i className="pi pi-ellipsis-h mr-2" onClick={(e) => menu.current.toggle(e)}></i>
                </div>
                <ListSubMenu
                    data={data}
                    menuRef={menu}
                    lists={lists}
                    setLists={setLists}
                />
            </div>
        );
    }

    const itemTemplate = (list) => {
        if (!list) {
            return;
        }

        return renderListItem(list);
    }


    return (
        <div className="card">
            <DataView
                value={lists}
                layout="list"
                itemTemplate={itemTemplate}
                rows={10}
                paginator={paginator}
                alwaysShowPaginator={false}
                emptyMessage="No list to display."
            />
        </div>
    );
}