import {Component} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import "./JoinDialog.scss"

class JoinDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            displayJoinDialog: false,
            listId: "",
            listTitle: "",
            username: ""
        };
        this.handleJoinRequest = this.handleJoinRequest.bind(this);
    }

    handleJoinRequest(listId, listTitle, username) {
        if (this.props.listId === listId) {
            this.setState({
                displayJoinDialog: true,
                listId,
                listTitle,
                username
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
            this.props.socket.emit("joinApproval", this.props.socket.id, this.state.listId, isApproved);
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
                showHeader={ false }
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
