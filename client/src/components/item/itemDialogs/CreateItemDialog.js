import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Dialog} from "primereact/dialog";
import React, {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";
import {useFormik} from "formik";
import { classNames } from 'primereact/utils';


export function CreateItemDialog({listId, displayDialog, setDisplayDialog, appendItem}){
    const [formData, setFormData] = useState({});
    const formik = useFormik({
        initialValues: {
            name: '',
            count: 1
        },
        validate: (data) => {
            let errors = {};
            if (!data.name) {
                errors.name = 'Item name is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            setFormData(data);
            setDisplayDialog(false);
            axios.post(
                "/lists/" + listId + "/items",
                {
                    listId: listId,
                    title: data.name,
                    count: data.count,
                    assignees: []
                }
            ).then(item => {
                console.log("created item titled " + item.data.title);
                appendItem(item.data);
                setItemName('');
                setItemNum(1);
            });
            formik.resetForm();
        }
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    const [itemName, setItemName] = useState('');
    const [itemNum, setItemNum] = useState(1);


    return (
        <Dialog header='Create a new task' dismissableMask={true} closable={false}
                visible={displayDialog} onHide={() => setDisplayDialog(false)}>
            <form onSubmit={formik.handleSubmit} className="p-fluid">
                <div className="field">
                    <label htmlFor="inputItemName">Name</label>
                    <span id="inputItemName" className="p-float-label">
                        <InputText id="name"
                                   autoFocus
                                   className={classNames({ 'p-invalid': isFormFieldValid('name') })}
                                   value={formik.values.name} onChange={formik.handleChange}/>
                        <label htmlFor="name"
                               className={classNames({ 'p-error': isFormFieldValid('name') })}
                        >Task Name</label>
                    </span>
                {getFormErrorMessage('name')}
                </div>

                <div className="field">
                    <label htmlFor="count">Task number</label>
                    <div className="grid">
                            <InputNumber
                                id="count"
                                inputId="count"
                                value={formik.values.count}
                                onValueChange={formik.handleChange}
                                showButtons
                                buttonLayout="horizontal"
                                decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary"
                                incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
                                min={1}/>
                    </div>
                </div>

                <div className="flex justify-content-center">
                    <Button label='Create' type='submit' />
                </div>
            </form>
        </Dialog>
    )
}