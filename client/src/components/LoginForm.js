import { Component } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loginFailed: false,
            isSubmitting: false
        };
        this.doLogin = this.doLogin.bind(this);
    }

    doLogin(e) {
        e.preventDefault();
        this.setState({
            isSubmitting: true
        });
        axios.post(
            "users/me/session",
            {
                email: this.state.email,
                password: this.state.password
            }
        )
        .then(
            user => this.props.setUser(user.data),
            error => {
                if (error.response.data.error === 1) {
                    this.setState({
                        loginFailed: true
                    });
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
                <div className="col-12 flex justify-content-center">
                    <img className="h-5rem" src="images/logo512.png"  alt="App logo" />
                </div>
                <div className="col-12 mt-5">
                    <h1 className="font-bold text-4xl">Log in</h1>
                    <h3 className="text-xl mt-3">Welcome back to Waffles</h3>
                </div>
                <div className="col-12 mt-3">
                    <form onSubmit={ this.doLogin } >
                        <span className="p-float-label p-input-icon-right w-full">
                            <i className="pi pi-envelope" />
                            <InputText
                                id="email"
                                name="email"
                                className={ "w-full" + (this.state.loginFailed ? " p-invalid" : "") }
                                value={ this.state.email }
                                onChange={ e => this.setState({ email: e.target.value }) }
                            />
                            <label htmlFor="email" className={ this.state.loginFailed ? "p-error" : "" }>E-mail</label>
                        </span>
                            <span className="p-float-label mt-2">
                            <Password
                                id="password"
                                name="password"
                                className={ "w-full" + (this.state.loginFailed ? " p-invalid" : "") }
                                value={ this.state.password }
                                onChange={ e => this.setState({ password: e.target.value }) }
                                feedback={ false }
                                toggleMask
                            />
                            <label htmlFor="password" className={ this.state.loginFailed ? "p-error" : "" }>Password</label>
                        </span>
                        <p className={ "text-sm p-error mt-2" + (this.state.loginFailed ? "" : " hidden") }>
                            Username or password are incorrect.
                        </p>
                        <Button disabled={ this.state.isSubmitting } type="submit" className="w-full mt-5" label="Login" />
                    </form>
                    <div className="flex justify-content-center mt-5">
                        <span>Not from around here? <Link to="/signup">Sign up</Link>.</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm;
