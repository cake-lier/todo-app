import { Component } from "react";
import {MainMenu} from "../../components/MainMenu";
import "./UserHome.css"

class UserHome extends Component {
    render() {
        return(
            //{ this.props.user._id }
            <div className="grid h-screen">
                <div className="hidden md:block">
                    <div className="col-6 h-screen no-padding"> {/* @todo remove padding here */}
                        <MainMenu/>
                    </div>
                </div>
            </div>
        );
    }
}

export default UserHome;

