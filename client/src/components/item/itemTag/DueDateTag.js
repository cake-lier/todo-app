import { Chip } from 'primereact/chip';
import "./ItemTag.scss";
import axios from "axios";

export function DueDateTag({itemId, dueDate, setDueDate}){
    const onRemove = () => {
        axios.put("/items/" + itemId + "/date")
            .then(r => {
                    setDueDate(null);
                },
                // TODO error
            )
    };

    function toDayMonth(date) {
        return date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
    }

    if(dueDate !== null && dueDate !== "") {
        let date = toDayMonth(new Date(dueDate));

        return (
            <Chip
                className="mr-2 mb-2 p-1 custom-chip"
                label={date}
                removable
                onRemove={onRemove}
                icon={<i key={date} className={"pi mr-1 pi-calendar" } />}
            />
        )
    } else {
        return null;
    }
}