import { useCallback, useRef } from "react";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import { ChangeAccountDataForm } from "../../../components/userPages/settings/changeAccountDataForm/ChangeAccountDataForm";
import DeleteAccountForm from "../../../components/userPages/settings/deleteAccountForm/DeleteAccountForm";
import ChangePasswordForm from "../../../components/userPages/settings/changePasswordForm/ChangePasswordForm";
import { Messages } from "primereact/messages";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import { useNavigate } from "react-router-dom";
import NotificationPreferencesForm
    from "../../../components/userPages/settings/notificationPreferencesForm/NotificationPreferencesForm";
import "./Settings.scss";

export default function Settings(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const messages = useRef();
    const displaySuccess =
        (msg) => messages.current.show({ severity: "success", content: msg });
    const navigate = useNavigate();
    const useOnTabClicked = url => {
        return useCallback(
            () => navigate("/settings/" + url), [url]
        );
    }

    const getTabElement = tabName => {
        if (tabName === "password") {
            return <ChangePasswordForm displaySuccess={ displaySuccess } displayError={ displayError } />;
        }
        if (tabName === "notifications") {
            return <NotificationPreferencesForm user={ props.user } setUser={ props.setUser } displayError={ displayError } />;
        }
        return (
            <>
                <ChangeAccountDataForm
                    user={ props.user }
                    setUser={ props.setUser }
                    displaySuccess={ displaySuccess }
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
                <SideMenu selected={ "Settings" } open={ true } />
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
