import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";

export default function JoinListMessage(){

    const [code, setCode] = useState("");

    const joinListHandler = () => {
        console.log("JOINED! :D")
    }

    return(
        <div className="grid">
            <div className="col-12 mt-2 p-0 flex flex-row align-items-center">
                <div className="col-9 m-0 p-0">
                    <InputText
                        className="p-inputtext-sm block mb- p-2 w-full h-2rem"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
                <div className="col-3">
                    <Button
                        className="w-full p-button-text"
                        label="Join"
                        type="submit"
                        onClick={joinListHandler}
                        autoFocus />
                </div>
            </div>
        </div>

    );
}