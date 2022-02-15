import { useState } from "react";
import { Calendar} from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";

export default function EditReminderDateDialog({ item, anonymousId, updateItem, displayEditReminderDate, setDisplayEditReminderDate, displayError }) {
    const setActualReminderDate = date => date && new Date(date) >= new Date() ? new Date(date) : (date ? new Date() : null);
    const [reminderDate, setReminderDate] = useState(setActualReminderDate(item.reminderDate));
    const insertReminderDate = () => {
        axios.put(
            `/items/${ item._id }/reminderDate`,
            { reminderDate },
            { params: anonymousId !== null ? { anonymousId } : {} }
        )
        .then(
            item => {
                updateItem(item.data);
                setDisplayEditReminderDate(false);
            },
            error => displayError(error.response.data.error)
        );
    };
    const reminderDateFooter = () => {
        return (
            <div className="flex justify-content-center pb-5 pt-3 px-3">
                <Button
                    className="mx-1"
                    label="Set reminder"
                    onClick={ insertReminderDate }
                    disabled={
                        item.reminderDate && new Date(item.reminderDate).valueOf() === new Date(reminderDate).valueOf()
                    }
                />
                <Button
                    className="mx-1"
                    label="Reset reminder"
                    onClick={ () => setReminderDate(setActualReminderDate(item.reminderDate)) }
                    disabled={
                        !item.reminderDate || new Date(item.reminderDate).valueOf() === new Date(reminderDate).valueOf()
                    }
                />
            </div>
        );
    }
    return (
        <Dialog
            footer={ reminderDateFooter() }
            dismissableMask={ true }
            closable={ false }
            visible={ displayEditReminderDate }
            onHide={ () => setDisplayEditReminderDate(false) }>
            <div className="grid">
                <Calendar
                    value={ reminderDate }
                    onChange={ e => setReminderDate(new Date(new Date(e.value).setSeconds(0, 0))) }
                    inline
                    showButtonBar={ true }
                    showTime
                    hourFormat="24"
                    dateFormat="dd/mm/yy"
                    maxDate={ item.dueDate ? new Date(item.dueDate) : null }
                    minDate={ new Date() }
                />
            </div>
        </Dialog>
    );
}
