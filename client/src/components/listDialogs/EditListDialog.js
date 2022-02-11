import {Button} from "primereact/button";
import ListDialog from "./ListDialog";
import axios from "axios";
import {useFormik} from "formik";

export default function EditListDialog({ display, setDisplay, updateList, listId, title, joinCode, colorIndex, ownership = true, displayError }) {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title,
            isVisible: !!joinCode,
            colorIndex
        },
        validate: data => {
            const errors = {};
            if (!data.title) {
                errors.title = "A title for the list is required.";
            }
            return errors;
        },
        onSubmit: data => {
            (
                data.title !== title
                ? axios.put(`/lists/${ listId }/title`, { title: data.title })
                : Promise.resolve(null)
            )
            .then(
                list =>
                    (
                        data.isVisible !== !!joinCode
                        ? axios.put(`/lists/${ listId }/isVisible`, { isVisible: data.isVisible })
                        : Promise.resolve(list)
                    )
                    .then(
                        list =>
                            (
                                data.colorIndex !== colorIndex
                                ? axios.put(`/lists/${ listId }/colorIndex`, { colorIndex: data.colorIndex })
                                : Promise.resolve(list)
                            )
                            .then(
                                list => {
                                    if (list !== null) {
                                        updateList(list.data);
                                    }
                                },
                                error => {
                                    if (list !== null) {
                                        updateList(list.data);
                                    }
                                    displayError(error.response.data.error)
                                }
                            ),
                        error => {
                            if (list !== null) {
                                updateList(list.data);
                            }
                            displayError(error.response.data.error);
                        }
                    ),
                error => displayError(error.response.data.error)
            );
            setDisplay(false);
            formik.resetForm(data);
        }
    });
    const isFormFieldValid = name => !formik.touched[name] || formik.errors[name] === undefined;
    const getFormErrorMessage =
            name => isFormFieldValid(name) ? "" : <p className="p-error text-sm">{ formik.errors[name] }</p>;
    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-12 p-5 flex justify-content-center">
                    <Button
                        className={"w-full m-0 p-button" + (formik.isSubmitting ? " disabled" : "")}
                        onClick={ formik.submitForm }
                        label="Save"
                        type="submit"
                    />
                </div>
            </div>
        );
    }
    return (
        <ListDialog
            dialogName="Update the list"
            display={ display }
            setDisplay={ setDisplay }
            renderFooter={ renderFooter }
            title={ formik.values.title }
            colorIndex={ formik.values.colorIndex }
            isVisible={ formik.values.isVisible }
            handleChange={ formik.handleChange }
            isFormFieldValid={ isFormFieldValid }
            getFormErrorMessage={ getFormErrorMessage }
            ownership={ ownership }
        />
    );
}
