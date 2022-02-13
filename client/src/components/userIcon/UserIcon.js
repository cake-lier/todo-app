import axios from "axios";
import { useCallback, useRef } from "react";
import { Menu } from 'primereact/menu';
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import "./UserIcon.scss";

export function UserIcon(props) {
    const { user, unsetUser, displayError } = props;
    const navigate = useNavigate();
    const handleOnClickSettings = useCallback(
        () => navigate("/settings"), [navigate]
    );
    const handleOnClickLogout = useCallback(
        () => {
            axios.delete("/users/me/session")
                 .then(unsetUser, error => displayError(error.response.data.error));
        },
        [unsetUser, displayError]
    );
    const items = [
        { label: `Username: ${ user.username }`, icon: PrimeIcons.USER, disabled: true },
        { label: `E-mail: ${ user.email }`, icon: PrimeIcons.ENVELOPE, disabled: true },
        { separator: true },
        { label: "Settings", icon: PrimeIcons.COG, command: handleOnClickSettings },
        { label: "Logout", icon: PrimeIcons.SIGN_OUT, command: handleOnClickLogout }
    ];
    const menu = useRef();
    return (
        <>
            <Menu id="profilePictureMenu" model={ items } popup ref={ menu } />
            <Avatar
                image={ props.user.profilePicturePath !== null ? props.user.profilePicturePath : "" }
                onClick={ e => menu.current.toggle(e) }
                shape="circle"
                className="w-3rem h-3rem"
            />
        </>
    );
}
