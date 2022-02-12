import { Chip } from "primereact/chip";
import axios from "axios";

export default function ChipTag({ itemId, tag, updateItem, displayError, isRemovable }){
    const colors = ["red-list", "purple-list", "blue-list", "green-list", "yellow-list"];
    const onRemove = () => {
        axios.delete(`/items/${ itemId }/tags/${ tag._id }`)
             .then(
                 item => updateItem(item.data),
                 error => displayError(error.response.data.error)
             );
    };
    return (
        <Chip
            className="mr-1 mb-1"
            label={ tag.title }
            icon={ <i key={ 0 } className={"pi mr-1 pi-circle-on " + (colors[tag.colorIndex]) } /> }
            removable={ isRemovable }
            onRemove={ onRemove }
        />
    );
}
