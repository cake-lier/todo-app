import {Tag} from "primereact/tag";

export function DueDateTag({dueDate}){

    function toDayMonth(date) {
        return date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
    }

    if(dueDate !== null && dueDate !== "") {
        let date = toDayMonth(new Date(dueDate));

        return (
            <Tag className="flex m-1 p-tag-rounded"
                 icon={<i key={date} className={"pi mr-1 pi-calendar" } />}
            >
                {date}
            </Tag>
        )
    } else {
        return null;
    }
}