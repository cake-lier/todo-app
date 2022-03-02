import { InputSwitch } from "primereact/inputswitch";
import {useState} from "react";
import axios from "axios";

export default function NotificationPreferencesForm({ user, setUser, displayError }) {
    const [notificationEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled);
    const changeNotificationsPreferences = enabled => {
        setNotificationsEnabled(enabled);
        axios.put("/users/me/enableNotifications", { enabled })
             .then(
                 user => setUser(user.data),
                 error => displayError(error.response.data.error)
             );
    };
    return (
        <form>
            <div className="grid align-items-center mt-3">
                <div className="col-12">
                    <h2 className="font-bold text-lg">Notifications</h2>
                </div>
                <div className="col-12">
                    <h3 className="text-md mt-2">
                        You have total control over push notifications you receive for each list. By default,
                        notifications are on for all lists. You can choose to turn them off for each individual list
                        or disable all notifications here.
                    </h3>
                </div>
                <div className="col-12">
                    <span className="mt-2 flex align-items-center">
                        <label className="mr-2" htmlFor="notifications">All notifications enabled</label>
                        <InputSwitch
                            id="notifications"
                            checked={ notificationEnabled }
                            onChange={ e => changeNotificationsPreferences(e.value) }
                        />
                    </span>
                </div>
            </div>
        </form>
    );
}
