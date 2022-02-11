import {Tag} from "primereact/tag";

export function ItemTag({text, colorIndex}){
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];


    return (
        <Tag className={"flex text-base font-normal m-1 p-2 p-tag-rounded " + (colors[colorIndex])}
             style={{border: "1px solid rgb(56, 55, 61, 0.3)"}}
             icon={<i className={"pi mr-1 pi-circle-on " + (colors[colorIndex]) } />}
        >
            {text}
        </Tag>
    )
}