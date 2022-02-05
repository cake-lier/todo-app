import {Tag} from "primereact/tag";

export function ItemTag({text, colorIndex}){
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];


    return (
        <Tag className="flex m-1 p-tag-rounded"
             icon={<i className={"pi mr-1 pi-circle-on " + (colors[colorIndex]) } />}
        >
            {text}
        </Tag>
    )
}