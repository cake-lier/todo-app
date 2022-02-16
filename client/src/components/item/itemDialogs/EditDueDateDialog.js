import { useState } from "react";
import { Calendar} from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";

export default function EditDueDateDialog({ item, anonymousId, updateItem, displayEditDueDate, setDisplayEditDueDate, displayError }) {
    const setActualDueDate = date => date && (new Date(date) >= new Date()) ? new Date(date) : (date ? new Date() : null);
    const [dueDate, setDueDate] = useState(setActualDueDate(item.dueDate));
    const insertDueDate = () => {
        axios.put(
            `/items/${ item._id }/dueDate`,
            { dueDate },
            { params: anonymousId !== null ? { anonymousId } : {} }
        )
        .then(
            item => {
                updateItem(item.data);
                setDisplayEditDueDate(false);
            },
            error => displayError(error.response.data.error)
        );
    };
    const dueDateFooter = () => {
        return (
            <div className="flex justify-content-center pb-5 pt-3 px-3">
                <Button
                    className="mx-1"
                    label="Set due date"
                    onClick={ insertDueDate }
                    disabled={ item.dueDate && new Date(item.dueDate).valueOf() === new Date(dueDate).valueOf() }
                />
                <Button
                    className="mx-1"
                    label="Reset due date"
                    onClick={ () => setDueDate(setActualDueDate(item.dueDate)) }
                    disabled={ !item.dueDate || new Date(item.dueDate).valueOf() === new Date(dueDate).valueOf() }
                />
            </div>
        );
    }
    return (
        <Dialog
            footer={ dueDateFooter() }
            closable={ false }
            dismissableMask={ true }
            draggable={ false }
            resizable={ false }
            visible={ displayEditDueDate }
            onHide={ () => setDisplayEditDueDate(false) }>
            <div className="grid">
               <Calendar
                   className="w-full"
                   value={ dueDate }
                   onChange={ e => setDueDate(new Date(new Date(e.value).setHours(23, 59, 59, 999))) }
                   inline
                   showButtonBar={ true }
                   dateFormat="dd/mm/yy"
                   minDate={ item.reminderDate ? new Date(item.reminderDate) : new Date() }
               />
            </div>
        </Dialog>
    );
}
