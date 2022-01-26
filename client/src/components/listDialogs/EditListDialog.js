import {useEffect, useState} from "react";
import {Button} from "primereact/button";
import ListDialog from "./ListDialog";
import axios from "axios";

export default function EditListDialog({display, setDisplay, lists, setLists, listId, title, joinCode, colorIndex, listMembers}) {
    const [state, setState] = useState("true");
    const [isSubmitting, setSubmitting] = useState("false");
    const [listName, setListName] = useState(title);
    const [isVisible, setVisibility] = useState(joinCode ? true : false)
    const [color, setColor] = useState(colorIndex);
    const [members, setMembers] = useState(listMembers);

    useEffect(() => {
        setListName(title);
        setVisibility(joinCode ? true : false);
        setColor(colorIndex);
        setMembers(listMembers);
    }, [title, joinCode, colorIndex, listMembers])

    const cancel = () => {
        setSubmitting(false);
        setState(true);
        setDisplay(false);
        setListName(title);
        setVisibility(joinCode ? true : false);
        setColor(colorIndex);
        setMembers(listMembers);
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
        const newLists = [...oldLists, updatedList];
        setLists(newLists);
        console.log(updatedList);
    }

    function editListTitle() {
        if (listName !== title) {
            axios.put(
                "/lists/" + listId + "/" + listName
            ).then(
                list => {
                    updateLists(list);
                    console.log("UPDATE TITLE")
                    console.log(list);
                },
                error => {
                    // TODO
                }
            )
        }
    }

    function editListVisibility() {
        if (isVisible !== (joinCode !== null)) {
            axios.put(
                "/lists/" + listId,
                {
                 body: {isVisible: isVisible}
                }
            ).then(
                list => {
                    updateLists(list);
                    console.log("UPDATE VISIBILITY")
                    console.log(list);
                },
                error => {
                    // TODO
                }
            )

            if (isVisible) {
                members.filter(m => m.role === "member").forEach(m => {
                        axios.delete(
                            "/lists/" + listId + "/members/" + m.userId
                        ).then(
                            list => {
                                updateLists(list);
                                setMembers(list.members);
                            },
                            error => {
                                // TODO
                            }
                        )
                    }
                )
            }
        }
    }

    function editListColor() {
        console.log("/lists/"+listId+"/"+color)
        if (color !== colorIndex) {
            const body = {colorIndex: color};
            axios.put(
                "/lists/"+listId, body
            ).then(
                list => {
                    updateLists(list);
                    console.log("UPDATE COLOR")
                    console.log(list);
                },
                error => {
                    // TODO
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
            members={members}
        />
    );
}