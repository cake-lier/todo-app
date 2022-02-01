import { Component } from "react";
import { Messages } from "primereact/messages";

class ErrorMessages extends Component {

    constructor(props) {
        super(props);
        this.displayError = this.displayError.bind(this);
    }

    displayError(error) {
        switch (error) {
            case 0:
                this.messages.show({ severity: "error", content: "An error has occurred, please try again later." });
                break;
            case 1:
                this.messages.show({
                    severity: "error",
                    content: "The given username or password were incorrect, please try again with another username or password."
                });
                break;
            case 2:
                this.messages.show({
                    severity: "error",
                    content: "The given password was incorrect, please try again with a different password."
                });
                break;
            case 3:
                this.messages.show({
                    severity: "error",
                    content: "Signup is required for performing this operation, please login before retrying again."
                });
                break;
            case 4:
                this.messages.show({
                    severity: "error",
                    content: "An error has occurred while performing the request, please try again."
                });
                break;
            case 5:
                this.messages.show({
                    severity: "error",
                    content: "An error has occurred while fetching the requested resource, please try again."
                });
                break;
            case 97:
                this.messages.show({
                    severity: "info",
                    content: "The owner of the list you are trying to join is not currently reachable or denied your request."
                });
                break;
            case 98:
                this.messages.show({
                    severity: "error",
                    content: "An error has occurred while trying to join the list. Are you sure the join code is correct?"
                });
                break;
            case 99:
                this.messages.show({
                    severity: "error",
                    content: "An error has occurred while loading the selected image, please try again."
                });
                break;
            default:
        }
    }

    render() {
        return (
            <div className="col-12 fixed top-0" style={{ zIndex: 1001 }}>
                <Messages ref={ e => this.messages = e }   />
            </div>
        );
    }
}

export default ErrorMessages;
