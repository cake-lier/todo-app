import { Component } from "react";
import { Card } from 'primereact/card';
import LoginForm from "../../components/LoginForm";
import ErrorMessages from "../../components/ErrorMessages";
import "./Login.css";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lastErrorCode: props.lastErrorCode
        };
        this.displayError = this.displayError.bind(this);
    }

    displayError(lastErrorCode) {
        this.setState({ lastErrorCode });
    }

    render() {
        return (
            <div className="grid h-screen align-items-center">
                <ErrorMessages lastErrorCode={ this.state.lastErrorCode !== 1 ? this.state.lastErrorCode : null } />
                <div className="col-4 col-offset-4 hidden md:block">
                    <Card>
                        <LoginForm setUser={ this.props.setUser } displayError={ this.displayError } />
                    </Card>
                </div>
                <div className="col-12 md:hidden">
                    <LoginForm setUser={ this.props.setUser } displayError={ this.displayError } />
                </div>
            </div>
        );
    }
}

export default Login;
