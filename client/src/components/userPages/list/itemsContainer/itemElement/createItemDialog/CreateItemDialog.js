import {ItemDialog} from "../itemDialog/ItemDialog";
import axios from "axios";

export default function CreateItemDialog({ listId, anonymousId, appendItem, displayDialog, setDisplayDialog, displayError }) {
    const onSubmit = data => {
        axios.post(
            `/lists/${ listId }/items`,
            {
                listId,
                title: data.title,
                count: data.count
            },
            { params: anonymousId !== null ? { anonymousId } : {} }
        ).then(
            item => appendItem(item.data),
            error => displayError(error.response.data.error)
        );
    }
    return (
        <ItemDialog
            headerTitle="Create a new item"
            buttonText="Create"
            displayDialog={ displayDialog }
            setDisplayDialog={ setDisplayDialog }
            title=""
            count={ 1 }
            onSubmit={ onSubmit }
            resetAfterSubmit={ true }
            minCount={ 0 }
        />
    )
}
