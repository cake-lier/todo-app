import {useState} from "react";
import {Calendar} from "primereact/calendar";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";

export function DueDateDialog({itemId, displayCalendar, setDisplayCalendar}){
    const [date, setDate] = useState(null);

    const dueDateFooter = (btn_text, display) => {
        return (
            <div  className="flex justify-content-center">
                <Button label={btn_text} onClick={() => {
                    onHide(display);
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