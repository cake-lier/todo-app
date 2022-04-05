import { Fragment, useState } from "react";
import axios from "axios";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import "./ChangePasswordForm.css";
import {Divider} from "primereact/divider";
import {useFormik} from "formik";

export default function ChangePasswordForm(props) {
    const [oldPasswordErrorText, setOldPasswordErrorText] = useState("");
    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: ""
        },
        validate: data => {
            const errors = {};
            if (oldPasswordErrorText !== "") {
                setOldPasswordErrorText("");
            }
            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(data.newPassword)) {
                errors.newPassword = "The password does not conform to security rules.";
            }
            return errors;
        },
        onSubmit: data =>
            axios.put(
                "/users/me/password",
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword
                }
            )
            .then(
                _ => {
                    props.displaySuccess("The password was changed successfully.");
                    formik.resetForm();
                },
                error => {
                    if (error.response.data.error === 2) {
                        setOldPasswordErrorText("The current password is incorrect.");
                    } else {
                        props.displayError(error.response.data.error);
                    }
                }
            )
    });
    const isNewPasswordFieldValid = () => !formik.touched.newPassword || formik.errors.newPassword === undefined;
    const isOldPasswordFieldValid = () => oldPasswordErrorText === "";
    return (
        <div className="grid">
            <div className="col-12 mt-3">
                <h2 className="font-bold text-lg">Change password</h2>
                <h3 className="text-md mt-1">Please make sure it's a safe one!</h3>
            </div>
            <div className="col-12 mt-2">
                <form onSubmit={ formik.handleSubmit }>
                    <span className="p-float-label mt-2">
                        <Password
                            id="oldPassword"
                            name="oldPassword"
                            className={ "w-full" + (isOldPasswordFieldValid() ? "" : " p-invalid") }
                            value={ formik.values.oldPassword }
                            onChange={ formik.handleChange }
                            feedback={ false }
                            toggleMask
                        />
                        <label htmlFor="oldPassword" className={ isOldPasswordFieldValid() ? "" : "p-error" }>
                            Current password
                        </label>
                    </span>
                    { isOldPasswordFieldValid() ? null : <p className="p-error mt-1 text-sm">{ oldPasswordErrorText }</p> }
                    <span className="p-float-label mt-2">
                        <Password
                            id="newPassword"
                            name="newPassword"
                            className={ "w-full" + (isNewPasswordFieldValid() ? "" : " p-invalid") }
                            value={ formik.values.newPassword }
                            onChange={ formik.handleChange }
                            header={ <h3 className="font-semibold text-md mb-2">Pick a password</h3> }
                            footer={
                                <Fragment>
                                    <Divider />
                                    <h3 className="font-semibold text-md my-2">Password requirements</h3>
                                    <ul className="pl-2 ml-2 mt-0">
                                        <li className="mt-3">At least one lowercase character.</li>
                                        <li className="mt-2">At least one uppercase character.</li>
                                        <li className="mt-2">At least one numeric character.</li>
                                        <li className="mt-2">Minimum 8 characters long.</li>
                                    </ul>
                                </Fragment>
                            }
                            toggleMask
                        />
                        <label htmlFor="password" className={ isNewPasswordFieldValid() ? "" : "p-error" }>
                            New password
                        </label>
                    </span>
                    { isNewPasswordFieldValid() ? null : <p className="p-error mt-1 text-sm">{ formik.errors.newPassword }</p> }
                    <Button
                        disabled={ formik.isSubmitting }
                        type="submit"
                        className="w-full mt-3"
                        label="Update"
                    />
                </form>
            </div>
        </div>
    );
}
