import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import "./JoinDialog.scss"

export default function JoinDialog(){
    const renderFooter = () => {
        return (
            <div className="grid">
                <div className="col-12 pl-3 mt-4 flex justify-content-center">
                    <Button
                        id="accept-button"
                        className="w-full"
                        label="Accept"
                    />
                </div>
                <div className="col-12 pl-3 flex mb-3 justify-content-center">
                    <Button
                        id="refuse-button"
                        className="w-full"
                        label="Refuse"
                        //TODO onClick={  }
                    />
                </div>
            </div>
        );
    }
    return (
        <Dialog id="list-dialog" className="w-20rem m-3" visible={ true } footer={ renderFooter() } closable={ false } showHeader={ false }>
            <div className="grid flex justify-content-center">
                <div className="col-12 mt-5 flex align-items-center">
                    <p>An anonymous user is asking to to join your list.</p>
                </div>
            </div>
        </Dialog>
    );
}
