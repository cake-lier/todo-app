import {useEffect, useState} from "react";
import {Button} from "primereact/button";
import ListDialog from "./ListDialog";
import axios from "axios";

export default function EditListDialog({display, setDisplay, lists, setLists, listId, title, joinCode, colorIndex, ownership=true}) {
    const [state, setState] = useState("true");
    const [isSubmitting, setSubmitting] = useState("false");
    const [listName, setListName] = useState(title);
    const [isVisible, setVisibility] = useState(joinCode ? true : false)
    const [color, setColor] = useState(colorIndex);

    useEffect(() => {
        setListName(title);
        setVisibility(joinCode ? true : false);
        setColor(colorIndex);
    }, [title, joinCode, colorIndex])

    const cancel = () => {
        setSubmitting(false);
        setState(true);
        setDisplay(false);
        setListName(title);
        setVisibility(joinCode ? true : false);
        setColor(colorIndex);
    }

    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-6 p-3 flex justify-content-center">
                    <Button
                        className="w-full p-button-text"
                        label="Cancel"
                        onClick={() => cancel()} />
                </div>
                <div className="col-6 p-3 flex justify-content-center">
                    <Button
                        className={"w-full p-button-text" + (isSubmitting ? null : "disabled")}
                        onClick={(e) => editList(e)}
                        label="Save"
                        type="submit"
                        autoFocus />
                </div>
            </div>
        );
    }

    function updateLists(updatedList) {
        const oldLists = lists.filter((l) => l._id !== listId);
        const newLists = [...oldLists, updatedList.data];
        setLists(newLists);
    }

    function editListTitle() {
        if (listName !== title) {
            axios.put(
                "/lists/" + listId + "/title",
                {title: listName}
            ).then(
                list => {
                    updateLists(list);
                },
                error => {
                    //TODO
                }
            )
        }
    }

    function editListVisibility() {
        if (isVisible !== (joinCode !== null)) {
            axios.put(
                "/lists/" + listId + "/isVisible",
                {isVisible: isVisible}
            ).then(
                list => {
                    updateLists(list);
                },
                error => {
                    //TODO
                }
            )
        }
    }

    function editListColor() {
        if (color !== colorIndex) {
            axios.put(
                "/lists/"+listId+"/colorIndex",
                {colorIndex: color}
            ).then(
                list => {
                    updateLists(list);
                },
                error => {
                    //TODO
                }
            )
        }
    }

    const editList = (e) => {
        e.preventDefault();
        setSubmitting(true);
        editListTitle()
        editListVisibility()
        editListColor()
        setDisplay(false)
    }

    return (
        <ListDialog
            dialogName="Update the list"
            display={display}
            renderFooter={renderFooter}
            listName={listName}
            setListName={setListName}
            state={state}
            color={color}
            setColor={setColor}
            isVisible={isVisible}
            setVisibility={setVisibility}
            ownership={ownership}
        />
    );
}