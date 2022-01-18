import { Component } from "react";
import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            loginFailed: false
        };
        this.doLogin = this.doLogin.bind(this);
    }

    doLogin() {
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
                    <span className="p-float-label">
                        <InputText
                            id="email"
                            className={ "w-full" + (this.state.loginFailed ? " p-invalid" : "") }
                            value={ this.state.email }
                            onChange={ e => this.setState({ email: e.target.value }) }
                        />
                        <label htmlFor="email">E-mail</label>
                    </span>
                    <span className="p-float-label mt-2">
                        <Password
                            id="password"
                            className={ "w-full" + (this.state.loginFailed ? " p-invalid" : "") }
                            value={ this.state.password }
                            onChange={ e => this.setState({ password: e.target.value }) }
                            feedback={ false }
                            toggleMask
                        />
                        <label htmlFor="password">Password</label>
                    </span>
                    <small className={ "p-error mt-2" + (this.state.loginFailed ? "" : " hidden") }>
                        Username or password are incorrect.
                    </small>
                    <Button className="w-full mt-5" label="Login" onClick={ this.doLogin } />
                </div>
            </div>
        );
    }
}

export default LoginForm;
