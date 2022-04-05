import {ItemDialog} from "../itemDialog/ItemDialog";
import axios from "axios";

export default function EditItemDialog({ item, anonymousId, updateItem, displayEdit, setDisplayEdit, displayError }) {
    const onSubmit = data => {
        (
            data.title !== item.title
            ? axios.put(
                  `/items/${ item._id }/title`,
                  { title: data.title },
                  { params: anonymousId !== null ? { anonymousId } : {} }
              )
            : Promise.resolve(null)
        ).then(
            i1 => (
                data.count !== item.count
                ? axios.put(
                      `/items/${ item._id }/count`,
                      { count: data.count },
                      { params: anonymousId !== null ? { anonymousId } : {} }
                  )
                : Promise.resolve(i1)
            )
            .then(
                i2 => updateItem(i2.data),
                error => {
                    if (i1 !== null) {
                        updateItem(i1.data);
                    }
                    displayError(error.response.data.error);
                }
            ),
            error => displayError(error.response.data.error)
        );
    }
    return (
        <ItemDialog
            headerTitle="Edit the item"
            buttonText="Edit"
            displayDialog={ displayEdit }
            setDisplayDialog={ setDisplayEdit }
            title={ item.title }
            count={ item.count }
            onSubmit={ onSubmit }
            resetAfterSubmit={ false }
        />
    );
}
