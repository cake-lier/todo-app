import { Component } from "react";
import { Card } from 'primereact/card';
import SignupForm from "../../components/SignupForm";
import ErrorMessages from "../../components/ErrorMessages";
import "./Signup.css";

class Signup extends Component {

    constructor(props) {
        super(props);
        this.displayError = this.displayError.bind(this);
    }

    displayError(lastErrorCode) {
        this.errors.displayError(lastErrorCode);
    }

    render() {
        return (
            <div className="grid h-screen align-items-center">
                <ErrorMessages ref={ e => this.errors = e } />
                <div className="col-12 md:col-4 md:col-offset-4">
                    <Card>
                        <SignupForm setUser={ this.props.setUser } displayError={ this.displayError } />
                    </Card>
                </div>
            </div>
        );
    }
}

export default Signup;
