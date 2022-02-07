import { useState } from "react";
import Moment from "react-moment";
import { UserIcon } from "../userIcon/UserIcon";
import { TabMenu } from 'primereact/tabmenu';
import "./PageHeader.scss";
import Notification from "../notifications/Notifications";
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import {MainMenu} from "../mainMenu/MainMenu";
import {Divider} from "primereact/divider";

export default function PageHeader({ user, unsetUser, title, showDate, tabs, activeTabIndex, isResponsive, notifications, setNotifications, socket, displayError}) {
    const [activeIndex, setActiveIndex] = useState(activeTabIndex);
    const [visible, setVisible] = useState(false);
    if (isResponsive) {
        return (
            <div className="grid sticky top-0 z-5" style={{backgroundColor: "white"}}>
                <div className="col-9 p-0 m-0 flex flex-columns justify-content-right">
                    <Button id="burger-menu" icon="pi pi-bars cursor-pointer" onClick={() => setVisible(true)}/>
                    <Sidebar className="p-0 m-0 md:hidden" showCloseIcon={false} visible={visible} onHide={() => setVisible(false)}>
                        <MainMenu selected={(title? title : "My lists")}></MainMenu>
                    </Sidebar>
                    <div className="w-max m-0 flex flex-column justify-content-center">
                        <h3 className="text-3xl font-semibold flex align-items-center">{ title }</h3>
                        {
                          showDate
                          ? <p className="text-md w-max mt-1"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                          : null
                        }
                    </div>
                </div>
                <div className="col-3 pr-2 flex justify-content-end align-items-center">
                    <Notification
                        displayError={ displayError }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        notificationEnabled = { user.enableNotification }
                        listNotification={ user.disabledListNotification }
                    />
                    <UserIcon
                        user={ user }
                        unsetUser={ unsetUser }
                        displayError={ displayError }
                    />
                </div>
                <div className="col-12 w-full flex justify-content-center flex-grow-1 m-0 p-0">
                    {
                        tabs && tabs.length
                        ? <TabMenu
                              id="headerTabMenu"
                              className="border-none flex justify-content-center w-full m-0 p-0"
                              activeIndex={ activeIndex }
                              onTabChange={ e => setActiveIndex(e.index) }
                              model={ tabs }
                          />
                        : null
                    }
                </div>
                <div className="col-12 p-0 z-1 pb-3">
                    <Divider className="my-0" />
                </div>
            </div>
        );
    } else {
        return (
            <div className="grid">
                <div className="col-9 pl-3 flex flex-row m-0 p-0">
                    <div className="w-max m-0 flex flex-column justify-content-center">
                        <h3 className="text-3xl font-semibold flex align-items-center">{ title }</h3>
                        {
                            showDate
                            ? <p className="text-md w-max mt-1"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                            : null
                        }
                    </div>
                    {
                         tabs && tabs.length
                         ? <TabMenu
                               id="headerTabMenu"
                               className="border-none ml-2 mt-2 flex align-items-center overflow-hidden"
                               activeIndex={ activeIndex }
                               onTabChange={ e => setActiveIndex(e.index) }
                               model={ tabs }
                           />
                         : null
                    }
                </div>
                <div className="col-3 pr-3 flex justify-content-end align-items-center">
                    <Notification
                        displayError={ displayError }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        notificationEnabled = { user.enableNotification }
                        listNotification={ user.disabledListNotification }
                    />
                    <UserIcon
                        user={ user }
                        unsetUser={ unsetUser }
                        displayError={ displayError }
                    />
                </div>
                <div className="col-12 p-0 z-1">
                    <Divider className="my-0" />
                </div>
            </div>
        );
    }
};
