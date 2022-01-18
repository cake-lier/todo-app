import { Component } from "react";
import {MainMenu} from "../../components/MainMenu";
import "./UserHome.css"

class UserHome extends Component {
    render() {
        return(
            //{ this.props.user._id }
            <div className="grid screen h-screen">
                <div className="hidden md:block md:col-2">
                    <div className="col-1">
                        <MainMenu/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserHome;

