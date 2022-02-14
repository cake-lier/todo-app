import { Button } from "primereact/button";
import axios from "axios";
import { useFormik } from "formik";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {SelectButton} from "primereact/selectbutton";

export default function AddTagDialog({ itemId, anonymousId, display, setDisplay, updateItem, displayError }) {
    const formik = useFormik({
        initialValues: {
            title: "",
            colorIndex: 0
        },
        validate: data => {
            const errors = {};
            if (!data.title) {
                errors.title = "A title for the tag is required.";
            }
            return errors;
        },
        onSubmit: data => {
            axios.post(
                `/items/${ itemId }/tags`,
                {
                    title: data.title,
                    colorIndex: data.colorIndex
                },
                { params: anonymousId !== null ? { anonymousId } : {} }
            )
            .then(
                item => {
                    updateItem(item.data);
                    setDisplay(false);
                    formik.resetForm();
                },
                error => displayError(error.response.data.error)
            );
        }
    });
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage =
        name => isFormFieldValid(name) ? "" : <p className="p-error mx-2 text-sm">{ formik.errors[name] }</p>;
    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-12 p-5 flex justify-content-center">
                    <Button
                        className={"w-full m-0 p-button" + (formik.isSubmitting ? " p-disabled" : "")}
                        label="Save"
                        type="submit"
                        onClick={ formik.submitForm }
                    />
                </div>
            </div>
        );
    };
    const colorOptions = [
        { icon: 'pi pi-circle-fill', id: "pastel-red-option", value: 0 },
        { icon: 'pi pi-circle-fill', id: "pastel-purple-option", value: 1 },
        { icon: 'pi pi-circle-fill', id: "pastel-blue-option", value: 2 },
        { icon: 'pi pi-circle-fill', id: "pastel-green-option", value: 3 },
        { icon: 'pi pi-circle-fill', id: "pastel-yellow-option", value: 4 }
    ];
    const justifyTemplate = option => <i className={ option.icon } id={ option.id } />;
    const getLabelErrorClass = name => isFormFieldValid(name) ? "" : "p-error";
    const getFieldErrorClass = name => isFormFieldValid(name) ? "" : "p-invalid";
    return (
        <Dialog
            id="list-dialog"
            className="w-27rem m-3"
            visible={ display }
            footer={ renderFooter() }
            closable={ false }
            showHeader={ false }
            dismissableMask={ true }
            onHide={ () => setDisplay(false) }
        >
            <div className="grid">
                <div className="col-12 mt-3 flex justify-content-center">
                    <h1 className="text-2xl mb-2">Create a new tag</h1>
                </div>
                <div className="col-12">
                    <span className="p-float-label">
                        <InputText
                            className={ "w-full " + getFieldErrorClass("title") }
                            id="title"
                            name="title"
                            value={ formik.values.title }
                            onChange={ formik.handleChange }
                        />
                        <label className={ getLabelErrorClass("title") } htmlFor="title">
                            Tag title
                        </label>
                    </span>
                    { getFormErrorMessage("title") }
                </div>
                <div className="col-12 mt-2">
                    <h5 className="mb-1">Color</h5>
                    <SelectButton
                        id="colorIndex"
                        name="colorIndex"
                        className="block"
                        value={ formik.values.colorIndex }
                        options={ colorOptions }
                        unselectable={ false }
                        onChange={ formik.handleChange }
                        itemTemplate={ justifyTemplate }
                    />
                </div>
            </div>
        </Dialog>
    );
}
