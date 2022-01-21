import { useFormik } from "formik";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";

export function ChangeAccountDataForm(props) {
    const [profilePicture, setProfilePicture] = useState(props.user.profilePicturePath);
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";
    const fileUploader = useRef();
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: props.user.username,
            email: props.user.email
        },
        validate: data => {
            const errors = {};
            if (!data.username) {
                errors.username = "A username is required.";
            } else if (!/^[A-Z0-9_-]/i.test(data.username)) {
                errors.username = "A username must only contain letters, numbers, underscores and dashes.";
            } else if (data.username.length > 15) {
                errors.username = "A username must be no more than 15 characters long.";
            }
            if (!data.email) {
                errors.email = "An email is required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = "The email address is invalid";
            }
            return errors;
        },
        onSubmit: data => {
            axios.put(
                "/users/me/account",
                {
                    username: data.username === props.user.username ? undefined : data.username,
                    email: data.email === props.user.email ? undefined : data.email,
                    profilePicture:
                        profilePicture === props.user.profilePicturePath
                        ? undefined
                        : (profilePicture === defaultProfilePicture ? null : profilePicture)
                }
            )
            .then(
                user => {
                    props.setUser(user.data);
                    setProfilePicture(user.data.profilePicturePath);
                    fileUploader.current.clear();
                    formik.resetForm({ username: user.data.username, email: user.data.email });
                },
                error => props.displayError(error.response.data.error)
            );
        }
    });
    const encodeImage = e => {
        const reader = new FileReader();
        reader.readAsDataURL(e.files[0]);
        reader.onload = () => setProfilePicture(reader.result);
        reader.onerror = _ => props.displayError(99);
    };
    const clearUploadedImage = () => {
        fileUploader.current.clear();
        setProfilePicture(defaultProfilePicture);
    };
    const resetOriginalImage = () => {
        fileUploader.current.clear();
        setProfilePicture(props.user.profilePicturePath);
    };
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage =
        name => isFormFieldValid(name) ? "" : <p className="p-error mt-1 text-sm">{ formik.errors[name] }</p>;
    const getLabelErrorClass = name => isFormFieldValid(name) ? "" : "p-error";
    const getFieldErrorClass = name => isFormFieldValid(name) ? "" : "p-invalid";
    return (
        <form onSubmit={ formik.handleSubmit } className="p-fluid">
            <div className="grid align-items-center">
                <div className="col-12 mt-1 md:mt-3">
                    <h2 className="font-bold text-lg">Update your account data</h2>
                </div>
                <div className="col-5 md:col-4 mt-3 flex justify-content-center">
                    <img
                        id="chosenProfilePicture"
                        className="w-6rem h-6rem"
                        src={ profilePicture }
                        alt="Chosen profile avatar"
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
                        chooseLabel="Choose a new profile picture"
                        ref={ fileUploader }
                        disabled={ profilePicture !== props.user.profilePicturePath && profilePicture !== defaultProfilePicture }
                    />
                    <Button
                        className="mt-1"
                        icon="pi pi-trash"
                        label="Discard selected picture"
                        type="button"
                        onClick={ clearUploadedImage }
                        disabled={ profilePicture === defaultProfilePicture }
                    />
                    <Button
                        className="mt-1"
                        icon="pi pi-arrow-circle-left"
                        label="Revert to original picture"
                        type="button"
                        onClick={ resetOriginalImage }
                        disabled={ profilePicture === props.user.profilePicturePath }
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
                <label htmlFor="username" className={ getLabelErrorClass("username") }>Username</label>
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
                <label className={ getLabelErrorClass("email") } htmlFor="email">E-mail</label>
            </span>
            { getFormErrorMessage("email") }
            <Button disabled={ formik.isSubmitting } type="submit" className="w-full my-4" label="Update" />
        </form>
    );
}
