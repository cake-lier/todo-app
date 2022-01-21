import { Component } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "./DeleteAccountForm.scss";

class DeleteAccountForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            deletionFailed: false,
            isSubmitting: false
        };
        this.doDelete = this.doDelete.bind(this);
    }

    doDelete(e) {
        e.preventDefault();
        this.setState({
            isSubmitting: true
        });
        axios.delete(
            "/users/me",
            {
                data: {
                    password: this.state.password
                }
            }
        )
        .then(
            _ => this.props.unsetUser(),
            error => {
                if (error.response.data.error === 2) {
                    this.setState({
                        deletionFailed: true,
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
                    <h2 className="font-bold text-lg">Delete account</h2>
                    <h3 className="text-md mt-1">Once you delete your account, there's no going back!</h3>
                </div>
                <div className="col-12 mt-2">
                    <form onSubmit={ this.doDelete } >
                        <span className="p-float-label mt-2">
                            <Password
                                id="password"
                                name="password"
                                className={ "w-full" + (this.state.deletionFailed ? " p-invalid" : "") }
                                value={ this.state.password }
                                onChange={ e => this.setState({ password: e.target.value }) }
                                feedback={ false }
                                toggleMask
                            />
                            <label htmlFor="password" className={ this.state.deletionFailed ? "p-error" : "" }>Password</label>
                        </span>
                        <p className={ "text-sm p-error mt-2" + (this.state.deletionFailed ? "" : " hidden") }>
                            The password is incorrect.
                        </p>
                        <Button
                            id="deleteAccount"
                            disabled={ this.state.isSubmitting }
                            type="submit"
                            className="w-full mt-3"
                            label="Delete account"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

export default DeleteAccountForm;
