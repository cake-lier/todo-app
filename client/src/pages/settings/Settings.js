import { Component } from "react";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import { UserIcon } from "../../components/userIcon/UserIcon";
import ErrorMessages from "../../components/ErrorMessages";
import { Link } from "react-router-dom";
import { Divider } from "primereact/divider";
import { ChangeAccountDataForm } from "../../components/ChangeAccountDataForm";
import "./Settings.scss";
import DeleteAccountForm from "../../components/deleteAccountForm/DeleteAccountForm";
import ChangePasswordForm from "../../components/ChangePasswordForm";
import { Messages } from "primereact/messages";
import { InputSwitch } from 'primereact/inputswitch';
import {Button} from "primereact/button";
import {Password} from "primereact/password";

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePicture: props.user.profilePicture
        }
        this.displayError = this.displayError.bind(this);
        this.getTabElement = this.getTabElement.bind(this);
        this.displaySuccess = this.displaySuccess.bind(this);
    }

    displayError(lastErrorCode) {
        this.errors.displayError(lastErrorCode);
    }

    displaySuccess() {
        this.messages.show({ severity: "success", content: "The password was changed successfully." });
    }

    getTabElement(tabName) {
        if (tabName === "password") {
            return (
                <div className="grid">
                    <div className="col-5 ml-8">
                        <ChangePasswordForm displaySuccess={ this.displaySuccess } displayError={ this.displayError } />
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
                    <div className="col-5 ml-8">
                        <ChangeAccountDataForm
                            user={ this.props.user }
                            setUser={ this.props.setUser }
                            displayError={ this.displayError }
                        />
                    </div>
                </div>
                <Divider className="my-0" />
                <div className="grid">
                    <div className="col-5 ml-8">
                        <DeleteAccountForm unsetUser={ this.props.unsetUser } displayError={ this.displayError } />
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="grid h-screen">
                <ErrorMessages ref={ e => this.errors = e } />
                <div className="col-12 fixed top-0" style={{ zIndex: 1001 }}>
                    <Messages ref={ e => this.messages = e } />
                </div>
                <div id="settingsMainMenuContainer" className="mx-0 p-0 hidden md:block">
                    <MainMenu selected={ "Settings" } />
                </div>
                <div id="settingsPageContainer" className="mx-0 p-0hidden md:block">
                    <div className="grid">
                        <div className="col-12">
                            <div className="grid">
                                <div className="col-6">
                                    <div className="grid h-full">
                                        <div className="col-2 ml-5 flex justify-content-center align-items-center">
                                            <h3 className="text-3xl font-semibold">Settings</h3>
                                        </div>
                                        <div className="col-2 flex justify-content-center align-items-center">
                                            <div className={ "text-lg " + (this.props.tab === "account" ? "font-bold" : "") }>
                                                <Link to="/settings/account">Account</Link>
                                            </div>
                                        </div>
                                        <div className="col-2 flex justify-content-center align-items-center">
                                            <div className={"text-lg " + (this.props.tab === "password" ? "font-bold" : "") }>
                                                <Link to="/settings/password">Password</Link>
                                            </div>
                                        </div>
                                        <div className="col-2 flex justify-content-center align-items-center">
                                            <p className={"text-lg " + (this.props.tab === "notifications" ? "font-bold" : "") }>
                                                <Link to="/settings/notifications">Notifications</Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-5" />
                                <div className="col-1 flex justify-content-center">
                                    <UserIcon
                                        user={ this.props.user }
                                        unsetUser={ this.props.unsetUser }
                                        displayError={ this.displayError }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 p-0">
                            <Divider className="my-0" />
                        </div>
                        <div className="col-12">
                            { this.getTabElement(this.props.tab) }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Settings;

