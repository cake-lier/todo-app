import {Tag} from "primereact/tag";

export function ItemTag({itemId, text, colorIndex}){

    return(
            <Tag className="flex m-1 p-tag-rounded" icon="pi pi-circle-on">{text}</Tag>
    )
}