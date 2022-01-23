import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { bool, string } from "prop-types";
import "./MainMenu.scss";

export function MainMenu({ open, selected }) {
    const navigate = useNavigate();
    const useOnClicked = url => {
        return useCallback(
            () => navigate("/" + url), [url]
        );
    }

    const mainItems = [
        {
            label: "My day",
            icon: PrimeIcons.CHECK_SQUARE,
            disabled: selected === "My day",
            command: useOnClicked("my-day")
        },
        { label: "My lists", icon: PrimeIcons.LIST, disabled: selected === "My lists" },
        { label: "Shared with me", icon: PrimeIcons.USERS, disabled: selected === "Shared with me" },
        {
            label: "Calendar",
            icon: PrimeIcons.CALENDAR,
            disabled: selected === "Calendar",
            command: useOnClicked("calendar")
        },
        { label: "Reports", icon: PrimeIcons.CHART_BAR, disabled: selected === "Reports" },
        { label: "Achievements", icon: PrimeIcons.STAR, disabled: selected === "Achievements" }
    ];
    const subItems = [
        { label: "Search", icon: PrimeIcons.SEARCH, disabled: selected === "Search" },
        {
            label: "Settings",
            icon: PrimeIcons.COG,
            disabled: selected === "Settings",
            command: useOnClicked("settings")
        }
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
    selected: string.isRequired,
    open: bool.isRequired
}
