import {useState} from "react";
import {Calendar} from "primereact/calendar";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import axios from "axios";

export function DueDateDialog({itemId, displayCalendar, setDisplayCalendar, setDueDate}){
    const [date, setDate] = useState(null);

    const dueDateFooter = (btn_text, display) => {
        return (
            <div  className="flex justify-content-center pb-4">
                <Button label={btn_text} onClick={() => {
                    onHide(display);
                    console.log("duedate: " + date);

                    axios.put("/items/" + itemId + "/date", {dueDate: date})
                        .then(item => setDueDate(item.data.dueDate),
                            // TODO error
                        );

                    // TODO socket
                    // socket.emit('reminder', date2);
                }} />
            </div>
        )
    }

    const onHide = () => {
        setDisplayCalendar(false);
    }

    return (
        <Dialog footer={dueDateFooter('Set due date', setDisplayCalendar)} dismissableMask={true} closable={false} visible={displayCalendar} onHide={() => setDisplayCalendar(false)}>
            <Calendar id="time24" value={date} onChange={(e) => setDate(e.value)} inline stepMinute={2} />
        </Dialog>
    )
}