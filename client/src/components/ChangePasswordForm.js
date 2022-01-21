import { Component } from "react";
import axios from "axios";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import "./ChangePasswordForm.css";

class ChangePasswordForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            changeFailed: false,
            isSubmitting: false
        };
        this.doChange = this.doChange.bind(this);
    }

    doChange(e) {
        e.preventDefault();
        this.setState({
            isSubmitting: true
        });
        axios.put(
            "/users/me/password",
            {
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword
            }
        )
        .then(
            _ => {
                this.props.displaySuccess();
                this.setState({
                    isSubmitting: false
                });
            },
            error => {
                if (error.response.data.error === 2) {
                    this.setState({
                        changeFailed: true,
                        isSubmitting: false
                    });
                    return;
                }
                this.setState({
                    isSubmitting: false
                });
                this.props.displayError(error.response.data.error);
            }
        );
    }

    render() {
        return (
            <div className="grid">
                <div className="col-12 mt-3">
                    <h2 className="font-bold text-lg">Change password</h2>
                    <h3 className="text-md mt-1">Please make sure it's a safe one!</h3>
                </div>
                <div className="col-12 mt-2">
                    <form onSubmit={ this.doChange } >
                        <span className="p-float-label mt-2">
                            <Password
                                id="oldPassword"
                                name="oldPassword"
                                className={ "w-full" + (this.state.changeFailed ? " p-invalid" : "") }
                                value={ this.state.oldPassword }
                                onChange={ e => this.setState({ oldPassword: e.target.value }) }
                                feedback={ false }
                                toggleMask
                            />
                            <label htmlFor="oldPassword" className={ this.state.changeFailed ? "p-error" : "" }>
                                Current password
                            </label>
                        </span>
                        <p className={ "text-sm p-error mt-2 mb-3" + (this.state.changeFailed ? "" : " hidden") }>
                            The current password is incorrect.
                        </p>
                        <span className="p-float-label mt-2">
                            <Password
                                id="newPassword"
                                name="newPassword"
                                className="w-full"
                                value={ this.state.newPassword }
                                onChange={ e => this.setState({ newPassword: e.target.value }) }
                                toggleMask
                            />
                            <label htmlFor="password">New password</label>
                        </span>
                        <Button
                            disabled={ this.state.isSubmitting }
                            type="submit"
                            className="w-full mt-3"
                            label="Update"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default ChangePasswordForm;
