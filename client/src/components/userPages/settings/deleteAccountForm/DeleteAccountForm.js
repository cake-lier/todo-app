import { useCallback, useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import "./DeleteAccountForm.scss";

export default function DeleteAccountForm({ unsetUser, displayError }) {
    const [password, setPassword] = useState("");
    const [deletionFailed, setDeletionFailed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const doDelete = useCallback(e => {
        e.preventDefault();
        setIsSubmitting(true);
        axios.delete("/users/me", { data: { password } })
             .then(
                 _ => unsetUser(),
                 error => {
                     if (error.response.data.error === 2) {
                         setDeletionFailed(true);
                         setIsSubmitting(false);
                         return;
                     }
                     setIsSubmitting(false);
                     displayError(error.response.data.error);
                }
            );
        }, [password, unsetUser, setDeletionFailed, setIsSubmitting, displayError]);
    return (
        <div className="grid">
            <div className="col-12 mt-3">
                <h2 className="font-bold text-lg">Delete account</h2>
                <h3 className="text-md mt-1">Once you delete your account, there's no going back!</h3>
            </div>
            <div className="col-12 mt-2">
                <form onSubmit={ doDelete } >
                    <span className="p-float-label mt-2">
                        <Password
                            id="password"
                            name="password"
                            className={ "w-full" + (deletionFailed ? " p-invalid" : "") }
                            value={ password }
                            onChange={ e => setPassword(e.target.value) }
                            feedback={ false }
                            toggleMask
                        />
                        <label htmlFor="password" className={ deletionFailed ? "p-error" : "" }>Password</label>
                    </span>
                    <p className={ "text-sm p-error mt-2" + (deletionFailed ? "" : " hidden") }>
                        The password is incorrect.
                    </p>
                    <Button
                        disabled={ isSubmitting }
                        type="submit"
                        className="w-full mt-3"
                        label="Delete account"
                    />
                </form>
            </div>
        </div>
    );
}
