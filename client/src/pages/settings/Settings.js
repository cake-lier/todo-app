import {useCallback, useRef, useState} from "react";
import MainMenu from "../../components/mainMenu/MainMenu";
import ErrorMessages from "../../components/ErrorMessages";
import { ChangeAccountDataForm } from "../../components/ChangeAccountDataForm";
import DeleteAccountForm from "../../components/deleteAccountForm/DeleteAccountForm";
import ChangePasswordForm from "../../components/changePasswordForm/ChangePasswordForm";
import { Messages } from "primereact/messages";
import { InputSwitch } from 'primereact/inputswitch';
import "./Settings.scss";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Settings(props) {
    const [notificationEnabled, setNotificationsEnabled] = useState(props.user.notificationsEnabled);
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const messages = useRef();
    const displaySuccess = () => {
        messages.current.show({ severity: "success", content: "The password was changed successfully." });
    }
    const navigate = useNavigate();
    const useOnTabClicked = url => {
        return useCallback(
            () => navigate("/settings/" + url), [url]
        );
    }

    const changeNotification = enabled => {
        setNotificationsEnabled(enabled);
        axios.put("/users/me/enableNotifications", { enabled })
             .then(
                 user => props.setUser(user.data),
                 error => displayError(error.response.data.error)
             );
    }

    const getTabElement = tabName => {
        if (tabName === "password") {
            return <ChangePasswordForm displaySuccess={ displaySuccess } displayError={ displayError } />;
        }
        if (tabName === "notifications") {
            return (
                <>
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
                                    onChange={ e => changeNotification(e.value) }
                                />
                            </span>
                            </div>
                        </div>
                    </form>
                </>
            );
        }
        return (
            <>
                <ChangeAccountDataForm
                    user={ props.user }
                    setUser={ props.setUser }
                    displayError={ displayError }
                />
                <DeleteAccountForm unsetUser={ props.unsetUser } displayError={ displayError } />
            </>
        );
    }
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div className="col-12 fixed top-0" style={{ zIndex: 1001 }}>
                <Messages ref={ messages } />
            </div>

            <div id="settingsMainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Settings" } open={ true } />
            </div>

            <div id="settingsPageContainer" className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ "Settings" }
                    isResponsive={ false }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    tabs={ [
                        { label: "Account", command: useOnTabClicked("account") },
                        { label: "Password", command: useOnTabClicked("password") },
                        { label: "Notifications", command: useOnTabClicked("notifications") }
                    ] }
                    activeTabIndex={ props.tab === "account" ? 0 : (props.tab === "password" ? 1 : 2) }
                    displayError={ displayError }
                />
                <div className="grid overflow-y-auto justify-content-center">
                    <div className="col-12 md:col-10 lg:col-7 xl:col-6">
                        { getTabElement(props.tab) }
                    </div>
                </div>
            </div>
            <div id="settingsPageContainer" className="mx-0 p-0 w-full md:hidden">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ "Settings" }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    isResponsive={ true }
                    tabs={ [
                        { label: "Account", command: useOnTabClicked("account") },
                        { label: "Password", command: useOnTabClicked("password") },
                        { label: "Notifications", command: useOnTabClicked("notifications") }
                    ] }
                    activeTabIndex={ props.tab === "account" ? 0 : (props.tab === "password" ? 1 : 2) }
                    displayError={ displayError }
                />
                <div className="grid justify-content-center">
                    <div className="col-12 sm:col-11">
                        { getTabElement(props.tab) }
                    </div>
                </div>
            </div>
        </div>
    );
}
