import {ItemDialog} from "./ItemDialog";
import axios from "axios";


export function CreateItemDialog({listId, appendItem, displayDialog, setDisplayDialog}) {

    const action = (data) => {
        axios.post(
            "/lists/" + listId + "/items",
            {
                listId: listId,
                title: data.name,
                count: data.count,
                assignees: []
            }
        ).then(item => appendItem(item.data),
            // TODO error
        );
    }
    return (
        <ItemDialog
            headerTitle={'Create a new task!'}
            displayDialog={displayDialog}
            setDisplayDialog={setDisplayDialog}
            initName=''
            initCount={1}
            action={action}
        />
    )
}