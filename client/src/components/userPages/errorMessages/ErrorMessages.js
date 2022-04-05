import { forwardRef, useImperativeHandle, useRef } from "react";
import { Messages } from "primereact/messages";

function ErrorMessages(_, ref) {
    const messages = useRef();
    useImperativeHandle(ref, () => ({
        displayError: error => {
            switch (error) {
                case 0:
                    messages.current.show({ severity: "error", content: "An error has occurred, please try again later." });
                    break;
                case 1:
                    messages.current.show({
                        severity: "error",
                        content:
                            "The given username or password were incorrect, please try again with another username or password."
                    });
                    break;
                case 2:
                    messages.current.show({
                        severity: "error",
                        content: "The given password was incorrect, please try again with a different password."
                    });
                    break;
                case 3:
                    messages.current.show({
                        severity: "error",
                        content: "Signup is required for performing this operation, please login before retrying again."
                    });
                    break;
                case 4:
                    messages.current.show({
                        severity: "error",
                        content: "An error has occurred while performing the request, please try again."
                    });
                    break;
                case 5:
                    messages.current.show({
                        severity: "error",
                        content: "An error has occurred while fetching the requested resource, please try again."
                    });
                    break;
                case 96:
                    messages.current.show({
                        severity: "info",
                        content: "The owner of the list you are trying to join denied your request."
                    });
                    break;
                case 97:
                    messages.current.show({
                        severity: "info",
                        content: "The owner of the list you are trying to join is not currently reachable."
                    });
                    break;
                case 98:
                    messages.current.show({
                        severity: "error",
                        content: "An error has occurred while trying to join the list. Are you sure the join code is correct?"
                    });
                    break;
                case 99:
                    messages.current.show({
                        severity: "error",
                        content: "An error has occurred while loading the selected image, please try again."
                    });
                    break;
                default:
            }
        }
    }));
    return (
        <div className="col-12 fixed top-0" style={{ zIndex: 1001 }}>
            <Messages ref={ messages } />
        </div>
    );
}

export default forwardRef(ErrorMessages);
