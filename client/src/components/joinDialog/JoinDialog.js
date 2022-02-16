import {Component} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import "./JoinDialog.scss"
import axios from "axios";

class JoinDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayJoinDialog: false,
            listId: "",
            listTitle: "",
            username: "",
            anonymousSocket: null
        };
        this.handleJoinRequest = this.handleJoinRequest.bind(this);
    }

    handleJoinRequest(listId, listTitle, username, anonymousSocket) {
        if (this.props.listId === listId) {
            this.setState({
                displayJoinDialog: true,
                listId,
                listTitle,
                username,
                anonymousSocket
            });
        }
    }

    componentDidMount() {
        this.props.socket.off("joinRequest");
        this.props.socket.on("joinRequest", this.handleJoinRequest);
    }

    componentWillUnmount() {
        this.props.socket.off("joinRequest", this.handleJoinRequest);
        this.props.socket.on(
            "joinRequest",
            listId => this.props.socket.emit("joinApproval", this.props.socket.id, listId, false)
        );
    }

    render() {
        const handleResponse = isApproved => {
            if (isApproved) {
                axios.post(
                    `/lists/${ this.state.listId }/members`,
                    {
                        isAnonymous: true,
                        socketId: this.state.anonymousSocket,
                        username: this.state.username
                    }
                )
                .then(
                    list => {
                        this.props
                            .socket
                            .emit(
                                "joinApproval",
                                this.props.socket.id,
                                this.state.listId,
                                true,
                                list.data.members[list.data.members.length - 1].anonymousId
                            )
                    },
                    error => {
                        this.props.displayError(error.response.data.error);
                        this.props.socket.emit("joinApproval", this.props.socket.id, this.state.listId, false, null);
                    }
                );
            } else {
                this.props.socket.emit("joinApproval", this.props.socket.id, this.state.listId, false, null);
            }
            this.setState({
                displayJoinDialog: false
            });
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
                visible={ this.state.displayJoinDialog }
                footer={ renderFooter() }
                closable={ false }
                draggable={ false }
                resizable={ false }
                showHeader={ false }
                baseZIndex={ 1 }
            >
                <div className="grid flex justify-content-center">
                    <div className="col-12 mt-5 flex align-items-center">
                        <p className="text-xl">User "{ this.state.username }" is asking to join your list "{ this.state.listTitle }".</p>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default JoinDialog;
