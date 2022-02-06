import Moment from "react-moment";
import { UserIcon } from "../userIcon/UserIcon";
import { TabMenu } from 'primereact/tabmenu';
import "./PageHeader.scss";
import Notification from "../notifications/Notifications";

const PageHeader = ({ user, unsetUser, title, showDate, tabs, isResponsive, notifications, setNotifications, socket, displayError }) => {
    if (isResponsive) {
        return (
            <div className="grid">
                <div className="col-1"/>
                <div className="col-8 px-3 m-0 flex flex-columns justify-content-right">
                    <div className="w-max m-0 flex flex-column justify-content-center">
                        <h3 className="text-3xl font-semibold flex align-items-center">{ title }</h3>
                        {
                          showDate
                          ? <p className="text-md w-max mt-1"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                          : null
                        }
                    </div>
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
                <div className="col-12 w-full flex justify-content-center flex-grow-1 m-0 p-0">
                    {
                        tabs && tabs.length
                        ? <TabMenu id="headerTabMenu" className="border-none flex justify-content-center w-full m-0 p-0" model={ tabs } />
                        : null
                    }
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
                    { tabs && tabs.length ? <TabMenu id="headerTabMenu" className="border-none ml-2 mt-2 flex align-items-center overflow-hidden" model={ tabs } /> : null }
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
            </div>
        );
    }
};

export default PageHeader;
