import { Avatar } from "primereact/avatar";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";
import {Button} from "primereact/button";
import "./UpdateAssigneeRow.scss";
import _ from "lodash";

export default function UpdateAssigneeRow({ item, member, updateAssignee, assigneeSelectedId, setAssigneeSelectedId }) {
    const defaultProfilePicture = "/static/images/default_profile_picture.jpg";
    const defaultCount = item.assignees.filter(a => a.memberId === member._id)?.[0]?.count ?? 0;
    const [count, setCount] = useState(defaultCount);
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
            <div className="col-12 md:col-3">
                <InputNumber
                    id="count"
                    name="count"
                    className="w-full"
                    value={ count }
                    onValueChange={
                        e => {
                            if (e.value !== defaultCount) {
                                setAssigneeSelectedId(member._id);
                            } else {
                                setAssigneeSelectedId("");
                            }
                            setCount(e.value);
                        }
                    }
                    showButtons
                    disabled={ assigneeSelectedId !== "" && assigneeSelectedId !== member._id }
                    buttonLayout="stacked"
                    incrementButtonIcon="pi pi-angle-up"
                    decrementButtonIcon="pi pi-angle-down"
                    min={ 0 }
                    max={ defaultCount + item.count - _.sum(item.assignees.map(a => a.count)) }
                />
            </div>
            <div className="col-6 md:col-2 flex justify-content-center align-items-center">
                <Button
                    label={ item.assignees.findIndex(a => a.memberId === member._id) !== -1 ? "Update" : "Add" }
                    className="w-full"
                    disabled={ (assigneeSelectedId !== "" && assigneeSelectedId !== member._id) || count === defaultCount }
                    onClick={ () => updateAssignee(member, count) }
                />
            </div>
            <div className="col-6 md:col-2 flex justify-content-center align-items-center">
                <Button
                    label="Reset"
                    className="w-full"
                    disabled={ count === defaultCount }
                    onClick={ () => {
                        setCount(defaultCount);
                        setAssigneeSelectedId("");
                    } }
                />
            </div>
        </div>
    );
}
