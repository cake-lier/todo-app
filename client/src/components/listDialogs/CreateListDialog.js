import {Button} from "primereact/button";
import {useState} from "react";
import axios from "axios";
import ListDialog from "./ListDialog";

export default function CreateListDialog({display, setDisplay, lists, setLists, list}) {

    const [state, setState] = useState("true");
    const [isSubmitting, setSubmitting] = useState("false");
    const [listName, setListName] = useState(list? list.title : "");
    const [isVisible, setVisibility] = useState(list? list.joinCode===null : false);
    const [color, setColor] = useState(0);

    const cancel = () => {
        setSubmitting(false);
        setState(true);
        setListName("");
        setVisibility(false);
        setColor(0);
        setDisplay(false);
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
                        onClick={(e) => createList(e)}
                        label="Save"
                        type="submit"
                        autoFocus />
                </div>
            </div>
        );
    }

    const createList = (e) => {
        e.preventDefault();
        setSubmitting(true);
        if (listName !== "") {
            axios.post(
                "/lists",
                {
                    title: listName,
                    isVisible: isVisible,
                    colorIndex: color
                }
            ).then(
                list => {
                    const newList = [...lists, list.data];
                    setLists(newList);
                    console.log(list.data);
                    cancel();
                },
                error => {
                    // TO DO
                }
            )
        } else {
            setState(false);
            console.log("RIP")
        }
    }

    return (
        <ListDialog
            dialogName="Create a new list"
            display={display}
            renderFooter={renderFooter}
            listName={listName}
            setListName={setListName}
            state={state}
            color={color}
            setColor={setColor}
            isVisible={isVisible}
            setVisibility={setVisibility}
        />
    );
}