import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {SelectButton} from "primereact/selectbutton";
import "./ListDialog.scss"

export default function ListDialog({ dialogName, display, renderFooter, title, colorIndex, isVisible, handleChange, isFormFieldValid, getFormErrorMessage, ownership }){
    const colorOptions = [
        { icon: 'pi pi-circle-fill', id: "pastel-red-option", value: 0 },
        { icon: 'pi pi-circle-fill', id: "pastel-purple-option", value: 1 },
        { icon: 'pi pi-circle-fill', id: "pastel-blue-option", value: 2 },
        { icon: 'pi pi-circle-fill', id: "pastel-green-option", value: 3 },
        { icon: 'pi pi-circle-fill', id: "pastel-yellow-option", value: 4 }
    ];
    const visibilityOptions = [
        { label: "Private", value: false },
        { label: "Public", value: true }
    ];
    const justifyTemplate = option => <i className={ option.icon } id={ option.id } />;
    const getLabelErrorClass = name => isFormFieldValid(name) ? "" : "p-error";
    const getFieldErrorClass = name => isFormFieldValid(name) ? "" : "p-invalid";
    return (
        <Dialog id="list-dialog" className="w-27rem m-3" visible={ display } footer={ renderFooter() } closable={ false } showHeader={ false }>
            <div className="grid">
                <div className="col-12 mt-3 flex justify-content-center">
                    <h1 className="text-2xl mb-2">{ dialogName }</h1>
                </div>
                <div className="col-12">
                    <span className="p-float-label">
                        <InputText
                            className={ "w-full " + getFieldErrorClass("title") }
                            id="title"
                            name="title"
                            value={ title }
                            onChange={ handleChange }
                        />
                        <label className={ getLabelErrorClass("title") } htmlFor="title">
                            List Name
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
                        value={ colorIndex }
                        options={ colorOptions }
                        unselectable={ false }
                        onChange={ handleChange }
                        itemTemplate={ justifyTemplate }
                    />
                </div>
                <div className={"col-12 mt-1 " + (ownership ? "" : "hidden")}>
                    <h5 className="mb-1">Set list as: </h5>
                    <SelectButton
                        id="isVisible"
                        name="isVisible"
                        value={ isVisible }
                        options={ visibilityOptions }
                        unselectable={ false }
                        onChange={ handleChange }
                    />
                </div>
            </div>
        </Dialog>
    );
}
