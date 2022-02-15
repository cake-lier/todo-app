import {Tag} from "primereact/tag";

export function DueDateTag({dueDate}){

    function toDayMonth(date) {
        return date.toLocaleString('default', { month: 'short' }) + " " + date.getDate();
    }

    if(dueDate !== null && dueDate !== "") {
        let date = toDayMonth(new Date(dueDate));

        return (
            <Tag className="flex text-base font-normal m-1 p-2 p-tag-rounded"
                 style={{border: "1px solid rgb(56, 55, 61, 0.3)"}}
                 icon={<i key={date} className={"pi mr-1 pi-calendar" } />}
            >
                {date}
            </Tag>
        )
    } else {
        return null;
    }
}