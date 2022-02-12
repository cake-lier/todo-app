import { Avatar } from "primereact/avatar";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import {Button} from "primereact/button";
import "./AddAssigneeRow.scss";

export default function AddAssigneeRow({ item, member, addAssignee, runningTotal, setRunningTotal }) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";
    const [count, setCount] = useState(item.assignees.filter(a => a.memberId === member._id)?.[0]?.count ?? 0);
    return (
        <div className="col-12 grid justify-content-center">
            <div className="col-6 md:col-1 flex justify-content-center align-items-center">
                <Avatar
                    size='large'
                    className="p-avatar-circle"
                    image={ member.profilePicturePath ? member.profilePicturePath : defaultProfilePicture }
                    alt={ member.username + "'s profile picture" }
                />
            </div>
            <div className="col-6 md:col-2 flex justify-content-center align-items-center">
                <p className="ml-2">{ member.username }</p>
            </div>
            <div className="col-12 md:col-4">
                <InputNumber
                    id="count"
                    name="count"
                    className="w-full"
                    value={ count }
                    onValueChange={
                        e => {
                            setRunningTotal(runningTotal + (e.value - count));
                            setCount(e.value);
                        }
                    }
                    showButtons
                    buttonLayout="stacked"
                    decrementButtonClassName="p-button-secondary"
                    incrementButtonClassName="p-button-secondary"
                    incrementButtonIcon="pi pi-angle-up"
                    decrementButtonIcon="pi pi-angle-down"
                    min={ 0 }
                    max={ count + (item.count - runningTotal) }
                />
            </div>
            <div className="col-12 md:col-2 flex justify-content-center align-items-center">
                <Button
                    label={ item.assignees.findIndex(a => a.memberId === member._id) !== -1 ? "Update" : "Add" }
                    className="w-full"
                    onClick={ () => addAssignee(member, count) }
                />
            </div>
        </div>
    );
}
