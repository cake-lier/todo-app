import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Button} from "primereact/button";
import axios from "axios";

export default function AddMemberDialogContent({listId, setDisplay, lists, setLists, membersProfile, setMembersProfile}){

    const [email, setEmail] = useState("");

    const joinListHandler = () => {
        //TODO
        console.log("JOINED! :D")
        axios.post(
            /lists/ + listId + "/members",
            {body: email}
        ).then( r => {
            setDisplay(false)
            const oldListIdx = lists.indexOf(lists.filter(l => l._id === listId)[0])
            let newLists = lists
            newLists[oldListIdx] = r.data
            setLists(newLists)
            //setMembersProfile([...membersProfile, r.data.members[r.data.members.length-1]])
        })
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