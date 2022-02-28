import {InputText} from "primereact/inputtext";
import copy from "copy-to-clipboard";
import {useState} from "react";
import {Button} from "primereact/button";

export default function JoinCodeDialog({ joinCode }){
    const [buttonText, setButtonText] = useState("Copy code");
    const copyToClipboard = () => {
        copy(joinCode);
        setButtonText("Copied!");
    }
    return (
        <div className="grid">
            <div className="col-12 m-0 p-0">
                <p>Anyone on the Internet with this link can access this list.</p>
            </div>
            <div className="col-12 mt-3 p-0 flex flex-row align-items-center">
                <div className="col-8 m-0 p-0">
                    <InputText
                        className="p-inputtext w-full"
                        value={ joinCode }
                    />
                </div>
                <div className="col-4 flex justify-content-center">
                    <Button type="button" onClick={ copyToClipboard }>{ buttonText }</Button>
                </div>
            </div>
        </div>
    );
}
