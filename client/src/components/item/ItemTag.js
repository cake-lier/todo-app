import { Chip } from "primereact/chip";
import axios from "axios";

export default function ItemTag({ itemId, tag, removeTag, displayError }){
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];
    const onRemove = () => {
        axios.delete(`/items/${ itemId }/tags/${ tag._id }`)
             .then(
                 _ => removeTag(tag),
                 error => displayError(error.response.data.error)
             );
    };
    return (
        <Chip
            className="flex text-base font-normal m-1 p-2 p-tag-rounded"
            label={ tag.title }
            icon={ <i key={ 0 } className={"pi mr-1 pi-circle-on " + (colors[tag.colorIndex]) } /> }
            removable
            onRemove={ onRemove }
        />
    );
}