import { useCallback, useRef } from "react";
import { Card } from 'primereact/card';
import SignupForm from "../../../components/publicPages/signup/signupForm/SignupForm";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import "./Signup.css";

export default function Signup(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    return (
        <div className="grid h-screen align-items-center">
            <ErrorMessages ref={ e => this.errors = e } />
            <div className="col-12 md:col-4 md:col-offset-4">
                <Card>
                    <SignupForm setUser={ props.setUser } displayError={ displayError } />
                </Card>
            </div>
        </div>
    );
}
