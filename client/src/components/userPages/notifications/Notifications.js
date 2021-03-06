import { Badge } from "primereact/badge";
import { Toast } from 'primereact/toast';
import React, {useEffect, useRef} from "react";
import { OverlayPanel } from 'primereact/overlaypanel';
import { DataScroller } from 'primereact/datascroller';
import axios from "axios";
import "./Notifications.scss"
import {Avatar} from "primereact/avatar";
import {Divider} from "primereact/divider";
import {Button} from "primereact/button";
import Moment from "moment";
import {Link} from "react-router-dom";

export default function Notifications({ notifications, setNotifications, socket, displayError, notificationsEnabled, disabledNotificationsLists, notificationsUnread, setNotificationsUnread, isAnonymous }) {
    const toast = useRef(null);
    const panel = useRef(null);
    useEffect(() => {
        function handleUpdates(event, listId, text) {
            if ((/^(?:list|item)/.test(event) && !/Reload$/.test(event)) || /^reminder|achievement$/.test(event)) {
                if (!isAnonymous) {
                    axios.get("/users/me/notifications")
                         .then(
                             notifications => {
                                 setNotifications(notifications.data);
                                 if (notificationsEnabled && !(disabledNotificationsLists.includes(listId))) {
                                     toast.current.show({
                                         severity: 'info',
                                         detail: text,
                                         closable: false,
                                         life: 2000
                                     });
                                     setNotificationsUnread(true);
                                 }
                             },
                             error => displayError(error.response.data.error)
                         );
                } else {
                    toast.current.show({
                        severity: 'info',
                        detail: text,
                        closable: false,
                        life: 2000
                    });
                }
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [
        displayError,
        socket,
        setNotifications,
        notifications,
        setNotificationsUnread,
        toast,
        disabledNotificationsLists,
        notificationsEnabled,
        isAnonymous
    ]);

    const deleteNotification = id => {
        axios.delete(`/users/me/notifications/${ id }`)
             .then(
                 _ => setNotifications(notifications.filter(n => n._id !== id)),
                 error => displayError(error.response.data.error)
            );
    };

    const deleteAllNotifications = () => {
        axios.delete(`/users/me/notifications`)
             .then(
                 _ => setNotifications([]),
                 error => displayError(error.response.data.error)
             );
    };

    const itemTemplate = data => {
        const subtitle = Moment(data.insertionDate).fromNow().toString() + (data.listTitle ? " - List: " + data.listTitle : "");
        const memberIndex = data.text.indexOf("member")
        const secondPartIndex =
            data.text.includes("in the")
            ? data.text.indexOf("in the")
            : (data.text.includes("from the") ? data.text.indexOf("from the") : data.text.indexOf("to the"));
        const firstPartText = data.text.substring(
            0,
            (memberIndex === -1 ? data.text.length : (memberIndex + 7))
        );
        const secondPartText = memberIndex !== -1 ? data.text.substring(secondPartIndex-2) : null;
        const memberUsername = secondPartText !== null ? data.text.substring(memberIndex + 7, secondPartIndex) : null;
        const notificationText = () => (
            <div className="mx-2">
                <div className="flex align-items-center justify-content-start flex-wrap">
                    <p>
                        <span className="font-semibold text-base">{ data.authorUsername }</span>
                        <span className="font-normal text-base">{ firstPartText }</span>
                        <span className="font-semibold text-base">{ memberIndex === -1 ? null : memberUsername }</span>
                        <span className="font-normal text-base">
                            { memberIndex === -1 ? null : secondPartText.substring(secondPartText.indexOf(" ") + 1) }
                        </span>
                    </p>
                </div>
                <div>
                    <p className="text-sm py-1 font-normal">{ subtitle }</p>
                </div>
            </div>
        );
        return (
            <div className="grid p-2 pl-4 w-full" >
                <div className="col-11 p-0 flex align-items-center justify-content-start">
                    <Avatar
                        icon={ !data.authorUsername && !data.picturePath ? "pi pi-info-circle" : null }
                        image={
                            data.picturePath
                            ? "/static" + data.picturePath
                            : (data.authorUsername ? "/static/images/default_profile_picture.jpg" : null)
                        }
                        className="p-avatar-circle notification"
                    />
                    {
                        data.listId !== null
                        ? <Link to={ "/list/" + data.listId }>{ notificationText() }</Link>
                        : <Link to="/achievements">{ notificationText() }</Link>
                    }
                </div>
                <div className="col-1 px-0 flex justify-content-end align-items-start">
                    <Button
                        icon="pi pi-times"
                        className="p-button-rounded p-button-icon-only p-button-text remove-notification"
                        onClick={ () => deleteNotification(data._id) }
                    />
                </div>
            </div>
        );
    }
    return (
        <>
            <Toast ref={ toast } />
            {
                isAnonymous
                ? null
                : <>
                      <OverlayPanel
                          ref={ panel }
                          id="notifications-overlay-panel"
                          breakpoints={{'662px': '95vw'}}
                          style={{width: '460px'}}
                          onShow={ () => setNotificationsUnread(false) }
                          onHide={ () => setNotificationsUnread(false) }
                      >
                          <DataScroller
                              rows={ 5 }
                              inline
                              header={
                                  <div
                                      className={"notification-header grid p-0 "}
                                      onClick={ deleteAllNotifications }
                                  >
                                      <div className="col-12">
                                          <p>Notifications</p>
                                          <Divider className="mt-3 mb-1"/>
                                      </div>
                                      <div
                                          className={
                                              "col-12 py-0 " + (notifications.length ? "flex justify-content-start" : "hidden")
                                          }
                                      >
                                          <Button className="p-button-rounded p-button-text m-0 p-0 pr-1 red-color">
                                              Delete all
                                          </Button>
                                      </div>
                                  </div>
                              }
                              scrollHeight="350px"
                              itemTemplate={ itemTemplate }
                              emptyMessage={
                                  <div
                                      className="grid flex flex-1 pt-5 pb-6 flex-column justify-content-center align-items-center"
                                  >
                                      <svg
                                          className="opacity-20"
                                          width="150"
                                          height="84"
                                          viewBox="0 0 150 84"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                      >
                                          <rect x="5" width="140" height="8" rx="4" fill="#999"/>
                                          <rect x="30" y="13" width="90" height="8" rx="4" fill="#999"/>
                                          <rect x="15" y="31" width="120" height="8" rx="4" fill="#999"/>
                                          <rect x="36" y="44" width="78" height="8" rx="4" fill="#999"/>
                                          <rect x="5" y="62" width="140" height="8" rx="4" fill="#999"/>
                                          <rect x="25" y="75" width="100" height="8" rx="4" fill="#999"/>
                                      </svg>
                                      <p className="pt-4 text-lg text-center">There are no notifications.</p>
                                  </div>
                              }
                              value={ notifications }
                          />
                      </OverlayPanel>
                      <i
                          className="pi pi-bell mr-2 p-text-secondary p-overlay-badge cursor-pointer notification-bell"
                          style={{ fontSize: '2rem' }}
                          onClick={ e => panel.current.toggle(e) }
                      >
                          <Badge className={ notificationsUnread ? null : "hidden" } severity="danger" />
                      </i>
                  </>
            }
        </>
    );
}
