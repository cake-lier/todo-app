import React from 'react';
import { bool, func } from 'prop-types';

const BurgerMenu = ({open, setOpen}) => {

    const burgerStyle = {
        padding: "20px",
        fontSize: "2rem",
        position: "absolute",
        display: open ? "none" : "block"
    }

    return (
        <i className="pi pi-bars" onClick={() => setOpen(!open)} style={burgerStyle}></i>
    )
}

BurgerMenu.propTypes = {
    open: bool.isRequired,
    setOpen: func.isRequired,
};

export default BurgerMenu;