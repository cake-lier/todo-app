import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import React from "react";
import {Button} from "primereact/button";
import {useFormik} from "formik";

export function ItemDialog({ headerTitle, buttonText, displayDialog, setDisplayDialog, title, count, onSubmit, resetAfterSubmit }){
    const formik = useFormik({
        initialValues: {
            title,
            count
        },
        validate: data => {
            let errors = {};
            if (!data.title) {
                errors.title = "A title for the item is required.";
            }
            return errors;
        },
        onSubmit: data => {
            setDisplayDialog(false);
            onSubmit(data);
            if (resetAfterSubmit) {
                formik.resetForm();
            }
        }
    });
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage = name => isFormFieldValid(name) ? "" : <p className="p-error text-sm">{ formik.errors[name] }</p>;
    return (
        <Dialog
            header={ headerTitle }
            dismissableMask={ true }
            closable={ false }
            visible={ displayDialog }
            onHide={ () => setDisplayDialog(false) }
        >
            <form onSubmit={ formik.handleSubmit } className="p-fluid mt-2">
                <div className="field">
                    <span className="p-float-label">
                        <InputText
                            id="title"
                            name="title"
                            className={ isFormFieldValid("title") ? "" : "p-invalid" }
                            value={ formik.values.title }
                            onChange={ formik.handleChange }
                        />
                        <label htmlFor="title" className={ isFormFieldValid("title") ? "" : "p-error" }>
                            Title
                        </label>
                    </span>
                    { getFormErrorMessage("name") }
                </div>
                <div className="field">
                    <label htmlFor="count">Count</label>
                    <div className="grid">
                            <InputNumber
                                id="count"
                                name="count"
                                value={ formik.values.count }
                                onValueChange={ formik.handleChange }
                                showButtons
                                buttonLayout="horizontal"
                                decrementButtonClassName="p-button-secondary"
                                incrementButtonClassName="p-button-secondary"
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                min={ 0 }
                            />
                    </div>
                </div>
                <div className="flex justify-content-center">
                    <Button label={ buttonText } type="submit" />
                </div>
            </form>
        </Dialog>
    );
}
