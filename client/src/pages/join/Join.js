import { useRef } from "react";
import { Card } from "primereact/card";
import OTPInput from "otp-input-react";
import ErrorMessages from "../../components/ErrorMessages";
import { Button } from "primereact/button";
import "./Join.scss";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

export default function Join(props) {
    const navigate = useNavigate();
    const errors = useRef();
    const formik = useFormik({
        initialValues: {
            pinCode: "",
            username: "",
        },
        validate: data => {
            const errors = {};
            if (!data.username) {
                errors.username = "A username is required.";
            } else if (!/^[A-Z0-9_-]/i.test(data.username)) {
                errors.username = "A username must only contain letters, numbers, underscores and dashes.";
            } else if (data.username.length > 15) {
                errors.username = "The username should not exceed 15 characters in length.";
            }
            return errors;
        },
        onSubmit: data => {
            const handleJoinResponse = (listId, anonymousId) => {
                if (listId !== null) {
                    props.setAnonymousId(anonymousId);
                    navigate("/lists/" + listId);
                } else {
                    errors.current.displayError(96);
                    formik.setSubmitting(false);
                }
            };
            props.socket.once("joinResponse", handleJoinResponse);
            props.socket.emit("join", data.pinCode, data.username, props.socket.id, result => {
                if (result.error) {
                    errors.current.displayError(98);
                    props.socket.off("joinResponse", handleJoinResponse);
                    formik.setSubmitting(false);
                } else if (!result.sent) {
                    errors.current.displayError(97);
                    props.socket.off("joinResponse", handleJoinResponse);
                    formik.setSubmitting(false);
                }
            });
        }
    });
    const isUsernameFieldValid = () => !formik.touched.username || formik.errors.username === undefined;
    return (
        <div className="grid h-screen align-items-center justify-content-center">
            <ErrorMessages ref={ errors } />
            <div className="col-12 sm:col-8 md:col-6 lg:col-4">
                <Card>
                    <div className="grid">
                        <div className="col-12 flex justify-content-center">
                            <img className="h-5rem" src="images/logo512.png"  alt="App logo" />
                        </div>
                        <div className="col-12 mt-5">
                            <h1 className="font-bold text-4xl">Insert the joining code</h1>
                            <h3 className="text-xl mt-3">Be ready for collaborating!</h3>
                        </div>
                        <div className="col-12 mt-3" hidden={ formik.isSubmitting }>
                            <form onSubmit={ formik.handleSubmit } className="grid">
                                <span className="p-float-label p-input-icon-right w-full">
                                    <i className="pi pi-user" />
                                    <InputText
                                        id="username"
                                        name="username"
                                        className={ "w-full" + (isUsernameFieldValid() ? "" : " p-invalid") }
                                        value={ formik.values.username }
                                        onChange={ formik.handleChange }
                                    />
                                    <label htmlFor="username" className={ isUsernameFieldValid() ? "" : "p-error" }>
                                        Username
                                    </label>
                                </span>
                                {
                                  isUsernameFieldValid()
                                  ? ""
                                  : <p className="p-error mt-1 text-sm">{ formik.errors.username }</p>
                                }
                                <span id="pinCodeContainer" className="mt-3 w-full">
                                    <label htmlFor="pinCode">List pin code</label>
                                    <OTPInput
                                        id="pinCode"
                                        name="pinCode"
                                        value={ formik.values.pinCode }
                                        onChange={ otp => formik.setFieldValue("pinCode", otp) }
                                        autoFocus
                                        OTPLength={ 6 }
                                        className="border-round col-12 px-0 flex justify-content-between otpInput"
                                    />
                                </span>
                                <Button
                                    disabled={ formik.values.pinCode.length !== 6 || formik.isSubmitting }
                                    type="submit"
                                    className="col-12 mt-3"
                                    label="Join"
                                />
                            </form>
                        </div>
                        <div className={
                            "col-12 mt-5 justify-content-center align-items-center " + (!formik.isSubmitting ? "hidden" : "flex")
                        }>
                            <ProgressSpinner />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
