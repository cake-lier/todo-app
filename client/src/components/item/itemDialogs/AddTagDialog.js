import { Button } from "primereact/button";
import axios from "axios";
import { useFormik } from "formik";
import ListDialog from "../../listDialogs/ListDialog";

export function AddTagDialog({ itemId, display, setDisplay, updateTags }) {
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
                "/items/" + itemId + "/tags",
                {
                    title: data.title,
                    colorIndex: data.colorIndex
                }
            )
                .then(
                    item => {
                        updateTags(item.data.tags);
                        setDisplay(false);
                        formik.resetForm();
                    },
                    // TODO error
                );
        }
    });
    const cancel = () => {
        formik.resetForm();
        setDisplay(false);
    }
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage =
        name => isFormFieldValid(name) ? "" : <p className="p-error mx-2 text-sm">{ formik.errors[name] }</p>;
    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-6 p-3 flex justify-content-center">
                    <Button
                        className="w-full p-button-text"
                        label="Cancel"
                        onClick={ cancel } />
                </div>
                <div className="col-6 p-3 flex justify-content-center">
                    <Button
                        className={"w-full p-button" + (formik.isSubmitting ? " p-disabled" : "")}
                        label="Save"
                        type="submit"
                        onClick={ formik.submitForm }
                    />
                </div>
            </div>
        );
    }
    return (
        <ListDialog
            dialogName="Create a new tag"
            display={ display }
            renderFooter={ renderFooter }
            title={ formik.values.title }
            colorIndex={ formik.values.colorIndex }
            isVisible={ formik.values.isVisible }
            handleChange={ formik.handleChange }
            isFormFieldValid={ isFormFieldValid }
            getFormErrorMessage={ getFormErrorMessage }
        />
    );
}
