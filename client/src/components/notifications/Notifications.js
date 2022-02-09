import { Badge } from "primereact/badge";
import { Toast } from 'primereact/toast';
import React, {useEffect, useRef} from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataScroller } from 'primereact/datascroller';
import axios from "axios";
import "./Notifications.scss"

export default function Notifications({ notifications, setNotifications, socket, displayError, notificationsEnabled, disabledNotificationsLists, notificationsUnread, setNotificationsUnread }) {
    const toast = useRef(null);
    const panel = useRef(null);
    useEffect(() => {
        function handleUpdates(event) {
            if (event.includes("list") || event.includes("item")) {
                axios.get("/users/me/notifications")
                     .then(
                         notifications => {
                             setNotifications(notifications.data);
                             if (notificationsEnabled
                                 && notifications.data.length > 0
                                 && !(disabledNotificationsLists.includes(notifications.data[notifications.data.length - 1].listId))) {
                                 toast.current.show({
                                     severity: 'info',
                                     detail: notifications.data[notifications.data.length - 1].text,
                                     closable: false,
                                     life: 2000
                                 });
                                 setNotificationsUnread(true);
                             }
                         },
                         error => displayError(error.response.data.error)
                     );
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [displayError, socket, setNotifications, notifications, setNotificationsUnread, toast, disabledNotificationsLists, notificationsEnabled]);

    const deleteNotification = id => {
        axios.delete(`/users/me/notifications/${ id }`)
             .then(
                 _ => setNotifications(notifications.filter(n => n._id !== id)),
                 error => displayError(error.response.data.error)
            );
    }

    const deleteAllNotifications = () => {
        axios.delete(`/users/me/notifications`)
             .then(
                 _ => setNotifications([]),
                 error => displayError(error.response.data.error)
             );
    }

    const itemTemplate = data => {
        return (
            <div className="grid p-3 pl-3 w-full">
                <div className="col-12 p-0 m-0 flex justify-content-end">
                    <i className="pi pi-times"
                       onClick={ () => deleteNotification(data._id) }
                    />
                </div>
                <div className="col-12">
                    { data.text }
                </div>
            </div>
        );
    }

    return (
        <>
            <Toast ref={ toast } />
            <OverlayPanel ref={ panel } id="notifications-overlay-panel" style={{width: '450px'}}>
                <DataScroller
                    rows={ 5 }
                    inline
                    header={
                        <div
                            className={"grid justify-content-start p-0 pl-3 pt-2 underline " + (notifications.length ? null : "hidden")}
                            onClick={ deleteAllNotifications }
                        >
                            Delete all notifications
                        </div>
                    }
                    scrollHeight="400px"
                    itemTemplate={ itemTemplate }
                    emptyMessage={ <p className="p-3 border-0 text-xl">No notifications.</p>}
                    value={ notifications }
                />
            </OverlayPanel>

            <i className="pi pi-bell mr-2 p-text-secondary p-overlay-badge"
               style={{ fontSize: '2rem' }}
               onClick={ e => {
                   panel.current.toggle(e);
                   setNotificationsUnread(false);
               } }
            >
                <Badge className={ notificationsUnread ? null : "hidden" } severity="danger" />
            </i>
        </>
    )
}
