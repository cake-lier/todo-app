import { useCallback, useRef, useState } from "react";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import ErrorMessages from "../../components/ErrorMessages";
import { Divider } from "primereact/divider";
import { ChangeAccountDataForm } from "../../components/ChangeAccountDataForm";
import DeleteAccountForm from "../../components/deleteAccountForm/DeleteAccountForm";
import ChangePasswordForm from "../../components/changePasswordForm/ChangePasswordForm";
import { Messages } from "primereact/messages";
import { InputSwitch } from 'primereact/inputswitch';
import "./Settings.scss";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useNavigate } from "react-router-dom";
import BurgerMenu from "../../components/BurgerMenu";
import {useOnClickOutside} from "../../components/ClickOutsideHook";

export function Settings(props) {
    const errors = useRef();
    const displayError = lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }
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
    const getTabElement = tabName => {
        if (tabName === "password") {
            return (
                <div className="grid ">
                    <div className="col-12 md:col-5 md:ml-8">
                        <ChangePasswordForm displaySuccess={ displaySuccess } displayError={ displayError } />
                    </div>
                </div>
            );
        }
        if (tabName === "notifications") {
            return (
                <div className="grid">
                    <div className="col-12 mt-3">
                        <h2 className="font-bold text-lg">Notifications</h2>
                        <h3 className="text-md mt-2">
                            You have total control over push notifications you receive for each list. By default, notifications
                            are on for all lists. You can choose to turn them off for each individual list or disable all
                            notifications here.
                        </h3>
                    </div>
                    <div className="col-12 mt-2">
                        <form>
                            <span className="mt-2 flex align-items-center">
                                <label className="mr-2" htmlFor="notifications">All notifications enabled</label>
                                <InputSwitch id="notifications" checked={ true } />
                            </span>
                        </form>
                    </div>
                </div>
            );
        }
        return (
            <>
                <div className="grid">
                    <div className="col-12 md:col-5 md:ml-8">
                        <ChangeAccountDataForm
                            user={ props.user }
                            setUser={ props.setUser }
                            displayError={ displayError }
                        />
                    </div>
                </div>
                <Divider className="my-0" />
                <div className="grid">
                    <div className="col-12 md:col-5 md:ml-8">
                        <DeleteAccountForm unsetUser={ props.unsetUser } displayError={ displayError } />
                    </div>
                </div>
            </>
        );
    }
    const [open, setOpen] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
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

            <div id="settingsMainMenuContainer" className="mx-0 p-0 h-full absolute flex justify-content-center md:hidden">
                <div className="h-full w-full" ref={ node } style={ divStyle }>
                    <BurgerMenu open={ open } setOpen={ setOpen } />
                    <MainMenu selected={ "Settings" } open={ open } />
                </div>
            </div>

            <div id="settingsPageContainer" className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ "Settings" }
                    isResponsive={ false }
                    tabs={ [
                        { label: "Account", command: useOnTabClicked("account") },
                        { label: "Password", command: useOnTabClicked("password") },
                        { label: "Notifications", command: useOnTabClicked("notifications") }
                    ] }
                    displayError={ displayError }
                />
                <div className="grid overflow-y-auto">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-12 ">
                        { getTabElement(props.tab) }
                    </div>
                </div>
            </div>
            <div id="settingsPageContainer" className="mx-0 p-0 w-full md:hidden">
                <div
                    className={"black-overlay absolute h-full w-full z-5 " + (open ? null : "hidden")}
                />
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ "Settings" }
                    isResponsive={ true }
                    tabs={ [
                        { label: "Account", command: useOnTabClicked("account") },
                        { label: "Password", command: useOnTabClicked("password") },
                        { label: "Notifications", command: useOnTabClicked("notifications") }
                    ] }
                    displayError={ displayError }
                />
                <div className="grid">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-12">
                        { getTabElement(props.tab) }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;

