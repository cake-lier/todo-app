import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "./MainMenu.scss";
import {bool} from "prop-types";


export function MainMenu({open}, props) {
    const navigate = useNavigate();
    const handleOnSettingsClicked = useCallback(
        () => navigate("/settings"), [navigate]
    );

    const mainItems = [
        { label: "My day", icon: PrimeIcons.CHECK_SQUARE, disabled: props.selected === "My day" },
        { label: "My lists", icon: PrimeIcons.LIST, disabled: props.selected === "My lists" },
        { label: "Shared with me", icon: PrimeIcons.USERS, disabled: props.selected === "Shared with me" },
        { label: "Calendar", icon: PrimeIcons.CALENDAR, disabled: props.selected === "Calendar" },
        { label: "Reports", icon: PrimeIcons.CHART_BAR, disabled: props.selected === "Reports" },
        { label: "Achievements", icon: PrimeIcons.STAR, disabled: props.selected === "Achievements" }
    ];
    const subItems = [
        { label: "Search", icon: PrimeIcons.SEARCH, disabled: props.selected === "Search" },
        { label: "Settings", icon: PrimeIcons.COG, disabled: props.selected === "Settings", command: handleOnSettingsClicked }
    ];

    const expand = {
        borderRadius: '0px',
        transition: 'transform 0.3s ease-in-out',
        transform : open ? 'translateX(0)' : 'translateX(-100%)'
    };

    return (
        <div className="grid h-full w-min align-content-between"
             style={{...expand, backgroundColor: "#FFF"}}>
            <div className="col-12 p-0 flex"  style={expand}>
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" style={expand} model={ mainItems } />
            </div>
            <div className="col-12 p-0 flex"  style={expand}>
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" style={expand} model={ subItems } />
            </div>
        </div>
    );
}

MainMenu.propTypes = {
    open: bool.isRequired
}
