import { Chip } from 'primereact/chip';
import "./ItemTag.scss";

export function ItemTag({itemId, text, colorIndex}){
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];

    const onRemove = () => {
        console.log("removed");
    };

    return (
        <Chip
            className="mr-2 mb-2 p-1 custom-chip"
            label={text}
            removable
            onRemove={onRemove}
            icon={<i key={text} className={"pi mr-1 pi-circle-on " + (colors[colorIndex]) } />}
        />
    )
}