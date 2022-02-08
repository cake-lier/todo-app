import {ManageItemDialog} from "./ManageItemDialog";
import {DataView} from "primereact/dataview";
import React, {useState} from "react";
import {ItemTag} from "../ItemTag";
import axios from "axios";
import {AddTagDialog} from "./AddTagDialog";

export function EditTagDialog({itemId, removeTag, tags, updateTags, display, setDisplay}){

    const [addTagDialog, setAddTagDialog] = useState(false);

    const onRemove = (tag) => {
        axios.delete("/items/" + itemId + "/tags", { data: { tags: [tag] }})
            .then(r => {
                    removeTag(tag);
                },
                // TODO error
            )
    };

    const tagTemplate = (tag) => {
        return (
            <div className="col-12 flex flex-row justify-content-between">
                <div className="flex align-items-center mb-2" >
                    <ItemTag
                        itemId={itemId}
                        tag={tag}
                        removeTag={removeTag}
                        text={tag.title}
                        colorIndex={tag.colorIndex}
                    />
                </div>
                <div className="flex align-items-center  mb-2">
                    <i
                        className={"pi pi-times cursor-pointer mr-1"}
                        onClick={ () => onRemove(tag) }
                    />
                </div>
            </div>
        )
    }

    return (
        <>
            <ManageItemDialog
                title="Edit tags"
                display={display}
                setDisplay={setDisplay}
                setAddDialog={setAddTagDialog} >

                <DataView
                    value={ tags }
                    itemTemplate={ tagTemplate }
                    rows={ 10 }
                    paginator={ tags.length > 10 }
                    alwaysShowPaginator={ false }
                    emptyMessage="There are no tags for this task."
                />

            </ManageItemDialog>

            <AddTagDialog
                itemId={itemId}
                display={addTagDialog}
                setDisplay={setAddTagDialog}
                updateTags={updateTags}
            />
        </>
    )
}