import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";

export default function AddMemberDialogContent({ list, setDisplay, updateList, setMembers, displayError }){
    const [email, setEmail] = useState("");
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
                     .then(
                         members => setMembers(members.data),
                         error => displayError(error.response.data.error)
                     );
                updateList(list.data);
            },
            error => displayError(error.response.data.error)
        );
    }
    return (
        <div className="grid">
            <div className="col-12 m-0 flex flex-row align-items-center">
                <div className="col-9 m-0 p-0">
                    <span className="p-float-label">
                        <InputText
                            id="memberEmail"
                            name="memberEmail"
                            className="w-full"
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
                        <label htmlFor="memberEmail">
                            Member email
                        </label>
                    </span>
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
    );
}
