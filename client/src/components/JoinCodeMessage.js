import {InputText} from "primereact/inputtext";
import copy from "copy-to-clipboard";
import {useState} from "react";

export default function JoinCodeMessage({joinCode}){

    const [buttonText, setButtonText] = useState("Copy code");

    console.log(joinCode)

    const copyToClipboard = () => {
        copy(joinCode);
        setButtonText("Copied!");
    }

    return(
        <div className="grid">
            <div className="col-12 m-0 p-0">
                <p>Anyone on the Internet with this link can access this list.</p>
            </div>
            <div className="col-12 mt-2 p-0 flex flex-row align-items-center">
                <div className="col-9 m-0 p-0">
                    <InputText
                        className="p-inputtext-sm block mb- p-2 w-full h-2rem pointer-events-none"
                        value={joinCode}
                    />
                </div>
                <div className="col-3">
                    <p style={{color: "blue"}} onClick={copyToClipboard}>{buttonText}</p>
                </div>
            </div>
        </div>

    );
}