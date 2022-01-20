import { Component } from "react";
import { Card } from 'primereact/card';
import LoginForm from "../../components/LoginForm";
import ErrorMessages from "../../components/ErrorMessages";
import "./Login.css";

class Login extends Component {

    constructor(props) {
        super(props);
        this.displayError = this.displayError.bind(this);
    }

    displayError(lastErrorCode) {
        if (lastErrorCode !== 1) {
            this.errors.displayError(lastErrorCode);
        }
    }

    render() {
        return (
            <div className="grid h-screen align-items-center">
                <ErrorMessages ref={ e => this.errors = e } />
                <div className="col-12 md:col-4 md:col-offset-4">
                    <Card>
                        <LoginForm setUser={ this.props.setUser } displayError={ this.displayError } />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Login;
