import { Component } from "react";
import Moment from "react-moment";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import { UserIcon } from "../../components/userIcon/UserIcon";
import ErrorMessages from "../../components/ErrorMessages";
import "./MyDay.scss";

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
                <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                    <MainMenu selected={ "My day" } />
                </div>
                <div id="pageContainer" className="mx-0 p-0 hidden md:block">
                    <div className="grid">
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

