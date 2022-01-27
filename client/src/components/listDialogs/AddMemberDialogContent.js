import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Button} from "primereact/button";

export default function AddMemberDialogContent(){

    const [email, setEmail] = useState("");

    const joinListHandler = () => {
        console.log("JOINED! :D")
    }

    return(
        <div className="grid">
            <div className="col-12 m-0 p-0 flex flex-row align-items-center">
                <div className="col-9 m-0 p-0">
                    <InputText
                        className="p-inputtext-sm block mb- p-2 w-full h-2rem"
                        value={email}
                        placeholder="Member email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="col-3">
                    <Button
                        className="w-full p-button-text"
                        label="Add"
                        type="submit"
                        onClick={joinListHandler}
                        autoFocus />
                </div>
            </div>
        </div>

    );
}