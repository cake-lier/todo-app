import { Badge } from "primereact/badge";
import {useEffect, useRef, useState} from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataView } from 'primereact/dataview';
import axios from "axios";
import "./Notifications.scss"

export default function Notification({notifications, setNotifications, socket, displayError}) {

    const panel = useRef(null);

    useEffect(() => {
        function handleUpdates(event) {
            if (event.toString().includes("list") || event.toString().includes("item")) {
                axios.get("/users/me/notifications")
                    .then(
                        notifications => {
                            console.log(notifications);
                            setNotifications(notifications.data);
                        },
                        error => displayError(error.response.data.error)
                    );
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [displayError, socket, setNotifications, notifications]);

    const deleteNotification = (id) => {
        axios.delete(`/users/me/notifications/${id}`)
             .then(
                 _ => setNotifications(notifications.filter(n => n._id !== id)),
                 error => displayError(error)
            )
    }

    const itemTemplate = (data) => {
        console.log(data)
        return (
            <div className="grid p-3 w-full">
                <div className="col-12 p-0 m-0 flex justify-content-end">
                    <i className="pi pi-times"
                       onClick={() => deleteNotification(data._id)}
                    />
                </div>
                <div className="col-12">
                    {data.text}
                </div>
            </div>
        );
    }

    return(
        <>
            <OverlayPanel ref={panel} id="notifications-overlay-panel" style={{width: '450px'}}>
                <DataView
                    className={ notifications?.length > 10? "overflow-y-auto" : null }
                    layout="list"
                    itemTemplate={ itemTemplate }
                    emptyMessage="No notifications."
                    value={ notifications }
                />
            </OverlayPanel>

            <i className="pi pi-bell mr-3 p-text-secondary p-overlay-badge"
               style={{ fontSize: '2rem' }}
               onClick={(e) => panel.current.toggle(e) }
            >
                <Badge className={notifications?.length > 0 ? null : "hidden"} severity="danger" />
            </i>
        </>
    )
}