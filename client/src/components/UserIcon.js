import { Component } from "react";
import { Menu } from 'primereact/menu';


class UserIcon extends Component {

    render() {
        return (
            <>
                <Menu model={ items } popup ref={ e => this.menu = e } />
                <img
                    id="profilePicture"
                    src={
                        this.props.user.profilePicturePath === null
                        ? "images/default_profile_picture.jpg"
                        : this.props.user.profilePicturePath
                    }
                    onClick={ e => this.menu.current.toggle(e) }
                    alt="Profile avatar"
                />
            </>
        );
    }
}
