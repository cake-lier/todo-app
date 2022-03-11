import { useCallback, useRef } from "react";
import { Card } from "primereact/card";
import JoinForm from "../../../components/publicPages/join/joinForm/JoinForm";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import "./Join.scss";

export default function Join(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    return (
        <div className="grid h-screen align-items-center justify-content-center">
            <ErrorMessages ref={ errors } />
            <div className="col-12 sm:col-8 md:col-6 lg:col-4">
                <Card>
                    <JoinForm
                        setAnonymousId={ props.setAnonymousId }
                        socket={ props.socket }
                        displayError={ displayError }
                    />
                </Card>
            </div>
        </div>
    );
}
