import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
import { useState } from "react";
import "./JoinDialog.scss"

export default function JoinDialog({ listId, socket, displayError }) {
    const [displayJoinDialog, setDisplayJoinDialog] = useState(false);
    const [listTitle, setListTitle] = useState("");
    const [username, setUsername] = useState("");
    const [anonymousSocket, setAnonymousSocket] = useState(null);
    const handleJoinRequest = (socketListId, listTitle, username, anonymousSocket) => {
        if (listId === socketListId) {
            setDisplayJoinDialog(true);
            setListTitle(listTitle);
            setUsername(username);
            setAnonymousSocket(anonymousSocket);
        }
    };
    useState(() => {
        socket.off("joinRequest");
        socket.on("joinRequest", handleJoinRequest);
        return () => {
            socket.off("joinRequest", handleJoinRequest);
            socket.on(
                "joinRequest",
                (listId, listTitle, username, anonymousSocketId) =>
                    socket.emit("joinApproval", socket.id, listId, anonymousSocketId, false)
            );
        };
    });
    const handleResponse = isApproved => {
        if (isApproved) {
            axios.post(
                `/lists/${ listId }/members`,
                {
                    isAnonymous: true,
                    socketId: anonymousSocket,
                    username
                }
            )
            .then(
                list => socket.emit(
                    "joinApproval",
                    socket.id,
                    listId,
                    anonymousSocket,
                    true,
                    list.data.members[list.data.members.length - 1].anonymousId
                ),
                error => {
                    displayError(error.response.data.error);
                    socket.emit("joinApproval", socket.id, listId, anonymousSocket, false, null);
                }
            );
        } else {
            socket.emit("joinApproval", socket.id, listId, anonymousSocket, false, null);
        }
        setDisplayJoinDialog(false);
    };
    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-12 pl-3 mt-4 flex justify-content-center">
                    <Button
                        id="accept-button"
                        className="w-full"
                        label="Accept"
                        onClick={ () => handleResponse(true) }
                    />
                </div>
                <div className="col-12 pl-3 flex mb-3 justify-content-center">
                    <Button
                        id="refuse-button"
                        className="w-full"
                        label="Refuse"
                        onClick={ () => handleResponse(false) }
                    />
                </div>
            </div>
        );
    };
    return (
        <Dialog
            id="list-dialog"
            className="m-3"
            visible={ displayJoinDialog }
            footer={ renderFooter() }
            closable={ false }
            draggable={ false }
            resizable={ false }
            showHeader={ false }
            baseZIndex={ 1 }
        >
            <div className="grid flex justify-content-center">
                <div className="col-12 mt-5 flex align-items-center">
                    <p className="text-xl">User "{ username }" is asking to join your list "{ listTitle }".</p>
                </div>
            </div>
        </Dialog>
    );
}
