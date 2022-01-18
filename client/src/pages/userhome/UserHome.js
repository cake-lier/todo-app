import { Component } from "react";

class UserHome extends Component {

    render() {
        return (
            <div>
                { this.props.user._id }
            </div>
        );
    }
}

export default UserHome;
