import {Dialog} from "primereact/dialog";
import { DataView} from 'primereact/dataview';
import { Avatar } from 'primereact/avatar';
import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "primereact/button";
import AddMemberDialogContent from "./AddMemberDialogContent";

export default function MembersDialog({display, setDisplay, listId, lists, setLists, members=[], ownership}){

    const [displayAddMember, setDisplayAddMember] = useState();
    const [membersProfile, setMembersProfile] = useState([]);

    useEffect(() => {
        let array = [];
        members.forEach(m => {
            axios.get("/lists/member/" + m.userId)
                .then(
                    result => {
                        array = [...array, {...result.data, role: m.role, memberId: m._id}]
                        setMembersProfile(array)
                    },
                    error => {

                    })
            })
    }, [members]);

    const removeMember = (item) => {
        //TODO
        console.log(item.memberId)
        axios.delete(
            "/lists/" + listId + "/members/" + item.memberId
        ).then(
            r => {
                const newMembers = membersProfile.filter(m => m.memberId !== item.memberId)
                setMembersProfile(newMembers)
                const oldListIdx = lists.indexOf(lists.filter(l => l._id === listId)[0])
                let newLists = lists
                newLists[oldListIdx] = r.data
                setLists(newLists)
            }
        )
    }

    const renderHeader = () => {
        return (
            <div className="grid flex flex-row align-items-center">
                <h1>Members</h1>
                <Button
                    className="ml-3 p-1"
                    id="create-button"
                    label="Add"
                    icon="pi pi-plus"
                    iconPos="left"
                    onClick={() => setDisplayAddMember(true)}
                />
            </div>
        );
    }

    const iconTemplate = (item) => {
        return (
            <div className="col-12 m-0 p-0 flex flex-row align-items-center">
                <div className="col-1 m-0 p-0">
                    <Avatar
                        className="custom-target-icon"
                        image ={ item.profilePicturePath === null ? "images/default_profile_picture.jpg" : item.profilePicturePath}
                        size="small"
                        shape="circle"
                        alt={item.username + "'s profile picture"}
                    />
                </div>
                <div className="col-9">
                    <h1>{item.username}</h1>
                </div>
                <div className={"col-2 flex justify-content-end"}>
                    <h1 className={(item.role === "owner") ? null : "hidden"}>Admin</h1>
                    <i
                        className={"pi pi-times mr-1 " + (item.role !== "owner" && ownership ? null : "hidden")}
                        onClick={() => removeMember(item)}>
                    </i>
                </div>
            </div>
        );
    }

    return (
        <Dialog className="w-27rem m-3" visible={display} header={renderHeader()} onHide={() => setDisplay(false)}>

            <Dialog className="w-27rem m-3"
                    header="Add a member"
                    visible={displayAddMember}
                    onHide={() => setDisplayAddMember(false)}>
                <AddMemberDialogContent
                    listId={listId}
                    setDisplay={setDisplayAddMember}
                    lists={lists}
                    setLists={setLists}
                    membersProfile={membersProfile}
                    setMembersProfile={setMembersProfile}
                />
            </Dialog>

            <DataView
                value={membersProfile}
                itemTemplate={iconTemplate}
                rows={10}
                paginator={membersProfile.length > 10}
                alwaysShowPaginator={false}
            />
        </Dialog>
    );
}