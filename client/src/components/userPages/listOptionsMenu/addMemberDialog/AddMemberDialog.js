import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";
import {Dialog} from "primereact/dialog";

export default function AddMemberDialog({ list, display, setDisplay, updateList, setMembers, displayError }){
    const [email, setEmail] = useState("");
    const [emailErrorText, setEmailErrorText] = useState("");
    const joinListHandler = () => {
        axios.post(
            `/lists/${ list._id }/members`,
            {
                email,
                isAnonymous: false
            }
        )
        .then(
            list => {
                setDisplay(false);
                axios.get(`/lists/${ list.data._id }/members/`)
                     .then(members => setMembers(members.data), error => displayError(error.response.data.error));
                updateList(list.data);
            },
            error => {
                if (error.response.data.error === 6) {
                    setEmailErrorText("This email is not associated to any user.");
                } else {
                    displayError(error.response.data.error);
                }
            }
        );
    }
    const isEmailFieldValid = () => emailErrorText === "";
    return (
        <Dialog
            className="w-27rem m-3 pb-4"
            header="Add a member"
            visible={ display }
            closable={ false }
            dismissableMask={ true }
            draggable={ false }
            resizable={ false }
            onHide={ () => setDisplay(false) }
        >
            <div className="grid">
                <div className="col-12 m-0 flex flex-row align-items-center">
                    <div className="col-9 m-0 p-0">
                    <span className="p-float-label">
                        <InputText
                            id="memberEmail"
                            name="memberEmail"
                            className={ "w-full" + (isEmailFieldValid() ? "" : " p-invalid") }
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
                        <label htmlFor="memberEmail" className={ isEmailFieldValid() ? "" : "p-error" }>
                            Member email
                        </label>
                    </span>
                        { isEmailFieldValid() ? null : <p className="p-error mt-1 text-sm">{ emailErrorText }</p> }
                    </div>
                    <div className="col-3">
                        <Button
                            className="w-full p-button"
                            label="Add"
                            type="submit"
                            onClick={ joinListHandler }
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
}
