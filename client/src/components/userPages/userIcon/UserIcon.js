import axios from "axios";
import { useCallback, useRef } from "react";
import { Menu } from 'primereact/menu';
import { PrimeIcons } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import "./UserIcon.scss";

export function UserIcon({ user, unsetUser, displayError }) {
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
        { label: `Username: ${ user.username }`, icon: PrimeIcons.USER, disabled: true, className: "disabled-item"},
        { label: `E-mail: ${ user.email }`, icon: PrimeIcons.ENVELOPE, disabled: true, className: "disabled-item"},
        { separator: true },
        { label: "Settings", icon: PrimeIcons.COG, command: handleOnClickSettings },
        { label: "Logout", icon: PrimeIcons.SIGN_OUT, command: handleOnClickLogout }
    ];
    const menu = useRef();
    return (
        <>
            <Menu id="profilePictureMenu" className="w-min" model={ items } popup ref={ menu } />
            <Avatar
                image={ user.profilePicturePath !== null ? user.profilePicturePath : "" }
                onClick={ e => menu.current.toggle(e) }
                shape="circle"
                className="w-3rem h-3rem"
                aria-label="open user sub-menu"
            />
        </>
    );
}
