import {ItemDialog} from "./ItemDialog";
import axios from "axios";

export function EditItemDialog({item, updateItem, displayDialog, setDisplayDialog}) {

    const action = (data) => {
        if (data.name !== item.title) {
            axios.put(
                "/items/" + item._id + "/title",
                {
                    title: data.name
                }
            ).then(item => updateItem(item.data),
                // TODO error
            );
        }

        if (data.count !== item.count) {
            axios.put(
                "/items/" + item._id + "/count",
                {
                    count: data.count
                }
            ).then(item => updateItem(item.data),
                // TODO error
            );
        }
    }
    return (
        <ItemDialog
            headerTitle={'Edit task'}
            btnText={'Edit'}
            displayDialog={displayDialog}
            setDisplayDialog={setDisplayDialog}
            initName={item.title}
            initCount={item.count}
            action={action}
        />
    )
}