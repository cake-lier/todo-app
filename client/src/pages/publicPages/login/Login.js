import { useCallback, useRef } from "react";
import { Card } from 'primereact/card';
import LoginForm from "../../../components/publicPages/login/loginForm/LoginForm";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import "./Login.css";

export default function Login(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        if (lastErrorCode !== 1) {
            errors.current.displayError(lastErrorCode);
        }
    }, [errors]);
    return (
        <div className="grid h-screen align-items-center">
            <ErrorMessages ref={ e => this.errors = e } />
            <div className="col-12 md:col-4 md:col-offset-4">
                <Card><LoginForm setUser={ props.setUser } displayError={ displayError } /></Card>
            </div>
        </div>
    );
}
