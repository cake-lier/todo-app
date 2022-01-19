import { Component } from "react";
import {MainMenu} from "../../components/MainMenu";

class MyDay extends Component {
    render() {
        return(
            <div className="grid h-screen">
                <div className="hidden md:block">
                    <div className="col-6 h-screen p-0">
                        <MainMenu/>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyDay;

