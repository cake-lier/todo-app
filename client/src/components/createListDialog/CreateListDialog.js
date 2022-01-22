import { Dialog } from 'primereact/dialog';
import {Button} from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';
import {useState} from "react";
import "./CreateListDialog.scss"
import axios from "axios";

export default function CreateListDialog({display, setDisplay}) {

    const [state, setState] = useState("true");
    const [isSubmitting, setSubmitting] = useState("false");
    const [listName, setListName] = useState("");
    const [isPrivate, setPrivate] = useState("Private");
    const [color, setColor] = useState(0);

    const colorOptions = [
        {icon: 'pi pi-circle-fill', id: "pastel-red-option", value: 0},
        {icon: 'pi pi-circle-fill', id: "pastel-purple-option", value: 1},
        {icon: 'pi pi-circle-fill', id: "pastel-blue-option", value: 2},
        {icon: 'pi pi-circle-fill', id: "pastel-green-option", value: 3},
        {icon: 'pi pi-circle-fill', id: "pastel-yellow-option", value: 4}
    ];

    const visibilityOptions = ["Private", "Public"];

    const cancel = () => {
        setSubmitting(false);
        setState(true);
        setListName("");
        setPrivate("Private");
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

    const justifyTemplate = (option) => {
        return <i className={option.icon} id={option.id}></i>;
    }

    const createList = (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log("CLICKED")
        if (listName != "") {
            axios.post(
                "/lists",
                {
                    title: listName,
                    isVisible: isPrivate != "Private",
                    colorIndex: color
                }
            ).then(
                list => {
                    console.log(list.data);
                    console.log("SUBMIT")
                    cancel();
                },
                error => {
                }
            )
        } else {
            setState(false);
            console.log("RIP")
        }
    }

    return (
        <Dialog className="w-27rem m-3" visible={display} footer={renderFooter()} closable={false} showHeader={false}>
            <div className="grid">
                <div className="col-12 mt-3 flex justify-content-center">
                    <h1 className="text-1xl">Create a new list</h1>
                </div>
                <div className="col-12 mt-1">
                    <label
                        className="p-invalid block mb-1"
                        htmlFor="listName">Name
                    </label>
                    <InputText
                        className={"p-inputtext-sm block mb-2 w-full h-2rem" + (state ? null : " p-invalid")}
                        placeholder="List name"
                        id="listName"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                    />
                    <small id="username2-help"
                           className={(state ? "hidden" : "p-error block")}>
                        A name is required.
                    </small>
                </div>
                <div className="col-12 mt-1">
                    <h5 className="mb-1">Color</h5>
                    <SelectButton
                        className="block"
                        value={color}
                        options={colorOptions}
                        unselectable={false}
                        onChange={(e) => setColor(e.value)}
                        itemTemplate={justifyTemplate}
                    />
                </div>

                <div className="col-12 mt-1">
                    <h5 className="mb-1">Set list as: </h5>
                    <SelectButton
                        value={isPrivate}
                        options={visibilityOptions}
                        unselectable={false}
                        onChange={(e) => setPrivate(e.value)}
                    />
                </div>
            </div>
        </Dialog>
    );
}