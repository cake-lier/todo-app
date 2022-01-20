import { Component } from "react";
import Moment from "react-moment";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import { UserIcon } from "../../components/userIcon/UserIcon";
import ErrorMessages from "../../components/ErrorMessages";

class MyDay extends Component {

    constructor(props) {
        super(props);
        this.displayError = this.displayError.bind(this);
    }

    displayError(lastErrorCode) {
        this.errors.displayError(lastErrorCode);
    }

    render() {
        return (
            <div className="grid h-screen">
                <ErrorMessages ref={ e => this.errors = e } />
                <div className="mx-0 p-0 hidden md:block" style={{ width: "10%" }}>
                    <MainMenu selected={ "My day" } />
                </div>
                <div className="mx-0 p-0 hidden md:block" style={{ width: "90%" }}>
                    <div className="grid" style={{ backgroundColor: "#FFF" }}>
                        <div className="col-2 flex-columns justify-content-center">
                            <h3 className="text-3xl font-semibold">My day</h3>
                            <p className="text-md mt-2"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                        </div>
                        <div className="col-9"/>
                        <div className="col-1 flex justify-content-center">
                            <UserIcon
                                user={ this.props.user }
                                unsetUser={ this.props.unsetUser }
                                displayError={ this.displayError }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyDay;

