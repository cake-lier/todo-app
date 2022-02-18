import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { useFormik } from "formik";
import { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import TermsOfService from "./TermsOfService";
import { Divider } from "primereact/divider";
import { Link } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import CookiePolicy from "./CookiePolicy";

export default function SignupForm(props) {
    const [isTermsDialogVisible, setTermsDialogVisible] = useState(false);
    const [isCookiesDialogVisible, setCookiesDialogVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            accept: false
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
            if (!data.email) {
                errors.email = "An email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = "The email address is invalid";
            }
            if (!data.password) {
                errors.password = "A password is required.";
            } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(data.password)) {
                errors.password = "The password does not conform to security rules.";
            }
            if (!data.accept) {
                errors.accept = "You need to agree to the terms and conditions of this service before registering.";
            }
            return errors;
        },
        onSubmit: data =>
            axios.post(
                "users",
                {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    profilePicture
                }
            )
            .then(
                user => {
                    props.setUser(user.data)
                },
                error => {
                    props.displayError(error.response.data.error);
                    formik.resetForm();
                }
            )
    });
    const encodeImage = e => {
        const reader = new FileReader();
        reader.readAsDataURL(e.files[0]);
        reader.onload = () => setProfilePicture(reader.result);
        reader.onerror = _ => props.displayError(99);
    };
    const fileUploader = useRef();
    const clearUploadedImage = () => {
        fileUploader.current.clear();
        setProfilePicture(null);
    }
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage =
            name => isFormFieldValid(name) ? "" : <p className="p-error mt-1 text-sm">{ formik.errors[name] }</p>;
    const getLabelErrorClass = name => isFormFieldValid(name) ? "" : "p-error";
    const getFieldErrorClass = name => isFormFieldValid(name) ? "" : "p-invalid";
    return (
        <div className="grid">
            <Dialog
                header="Waffles' Terms of Service"
                className="w-12 md:w-6"
                visible={ isTermsDialogVisible }
                closable={ false }
                dismissableMask={ true }
                draggable={ false }
                resizable={ false }
                onHide={ () => setTermsDialogVisible(false) }>
                <TermsOfService />
            </Dialog>
            <Dialog
                header="Waffles' Cookie Policy"
                className="w-12 md:w-6"
                visible={ isCookiesDialogVisible }
                closable={ false }
                dismissableMask={ true }
                draggable={ false }
                resizable={ false }
                onHide={ () => setCookiesDialogVisible(false) }>
                <CookiePolicy />
            </Dialog>
            <div className="col-12 flex justify-content-center">
                <img className="h-5rem" src="/images/logo512.png"  alt="App logo" />
            </div>
            <div className="col-12 mt-3">
                <h1 className="font-bold text-4xl">Sign up</h1>
                <h3 className="text-xl mt-3">Create your free account</h3>
            </div>
            <div className="col-12 mt-3">
                <form onSubmit={ formik.handleSubmit } className="p-fluid">
                    <div className="grid align-items-center">
                        <div className="col-5 md:col-4 flex justify-content-center">
                            <Avatar
                                image={ profilePicture !== null ? profilePicture : "/static/images/default_profile_picture.jpg" }
                                shape="circle"
                                className="w-6rem h-6rem"
                            />
                        </div>
                        <div className="col-7 md:col-8">
                            <FileUpload
                                mode="basic"
                                auto
                                customUpload
                                maxFileSize={ 1048576 }
                                uploadHandler={ encodeImage }
                                accept=".jpg,.png"
                                chooseLabel="Choose a profile picture"
                                ref={ fileUploader }
                                disabled={ profilePicture !== null }
                            />
                            <Button
                                className="mt-1"
                                icon="pi pi-trash"
                                label="Discard current picture"
                                type="button"
                                onClick={ clearUploadedImage }
                                disabled={ profilePicture === null }
                            />
                        </div>
                    </div>
                    <span className="p-float-label p-input-icon-right w-full mt-2">
                        <i className="pi pi-user" />
                        <InputText
                            id="username"
                            name="username"
                            className={ "w-full " + getFieldErrorClass("username") }
                            value={ formik.values.username }
                            onChange={ formik.handleChange }
                        />
                        <label htmlFor="username" className={ getLabelErrorClass("username") }>Username*</label>
                    </span>
                    { getFormErrorMessage("username") }
                    <span className="p-float-label p-input-icon-right w-full mt-2">
                        <i className="pi pi-envelope" />
                        <InputText
                            id="email"
                            name="email"
                            className={ "w-full " + getFieldErrorClass("email") }
                            value={ formik.values.email }
                            onChange={ formik.handleChange }
                        />
                        <label className={ getLabelErrorClass("email") } htmlFor="email">E-mail*</label>
                    </span>
                    { getFormErrorMessage("email") }
                    <span className="p-float-label mt-2">
                        <Password
                            id="password"
                            name="password"
                            className={ "w-full " + getFieldErrorClass("password") }
                            value={ formik.values.password }
                            onChange={ formik.handleChange }
                            header={ <h3 className="font-semibold text-md mb-2">Pick a password</h3> }
                            footer={
                                <>
                                    <Divider />
                                    <h3 className="font-semibold text-md my-2">Password requirements</h3>
                                    <ul className="pl-2 ml-2 mt-0">
                                        <li className="mt-3">At least one lowercase character.</li>
                                        <li className="mt-2">At least one uppercase character.</li>
                                        <li className="mt-2">At least one numeric character.</li>
                                        <li className="mt-2">Minimum 8 characters long.</li>
                                    </ul>
                                </>
                            }
                            toggleMask
                            feedback
                        />
                        <label htmlFor="password" className={ getLabelErrorClass("password") }>Password*</label>
                    </span>
                    { getFormErrorMessage("password") }
                    <div className="p-field-checkbox mt-3 flex align-items-center">
                        <Checkbox
                            inputId="accept"
                            name="accept"
                            checked={ formik.values.accept }
                            onChange={ formik.handleChange }
                            className={ "mr-3 " + getFieldErrorClass("accept") }
                        />
                        <label htmlFor="accept" className={ "inline-block w-8 md:w-12 " + getLabelErrorClass("accept") }>
                            I read and agree to
                            Waffles' <button style={{ fontSize: "16px" }} onClick={ () => setTermsDialogVisible(true) }>
                                Terms of Service
                            </button> and <button style={{ fontSize: "16px" }} onClick={ () => setCookiesDialogVisible(true) }>
                                Cookie Policy
                            </button>.*
                        </label>
                    </div>
                    { getFormErrorMessage("accept") }
                    <Button disabled={ formik.isSubmitting } type="submit" className="w-full mt-4" label="Sign up" />
                </form>
                <div className="flex justify-content-center mt-5">
                    <span>Already have an account? <Link to="/login">Log in</Link>.</span>
                </div>
            </div>
        </div>
    );
}
