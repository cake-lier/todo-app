import React from 'react';
import { bool, func } from 'prop-types';

const BurgerMenu = ({open, setOpen}) => {

    const burgerStyle = {
        fontSize: "2rem",
        position: "absolute",
        display: open ? "none" : "block"
    }

    return (
        <i className="pi pi-bars pl-1 pt-4" onClick={() => setOpen(!open)} style={burgerStyle}></i>
    )
}

BurgerMenu.propTypes = {
    open: bool.isRequired,
    setOpen: func.isRequired,
};

export default BurgerMenu;