import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "./MainMenu.scss";

export function MainMenu(props) {
    const navigate = useNavigate();
    function useOnClicked(url) {
        return useCallback(
            () => navigate("/" + url), [url]
        );
    }
    const mainItems = [
        {
            label: "My day",
            icon: PrimeIcons.CHECK_SQUARE,
            disabled: props.selected === "My day",
            command: useOnClicked("my-day")
        },
        { label: "My lists", icon: PrimeIcons.LIST, disabled: props.selected === "My lists" },
        { label: "Shared with me", icon: PrimeIcons.USERS, disabled: props.selected === "Shared with me" },
        { label: "Calendar", icon: PrimeIcons.CALENDAR, disabled: props.selected === "Calendar" },
        { label: "Reports", icon: PrimeIcons.CHART_BAR, disabled: props.selected === "Reports" },
        { label: "Achievements", icon: PrimeIcons.STAR, disabled: props.selected === "Achievements" }
    ];
    const subItems = [
        { label: "Search", icon: PrimeIcons.SEARCH, disabled: props.selected === "Search" },
        {
            label: "Settings",
            icon: PrimeIcons.COG,
            disabled: props.selected === "Settings",
            command: useOnClicked("settings")
        }
    ];
    return (
        <div className="grid h-full align-content-between" style={{ backgroundColor: "#FFF" }}>
            <div className="col-12 p-0 flex">
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" model={ mainItems } />
            </div>
            <div className="col-12 p-0 flex">
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" model={ subItems } />
            </div>
        </div>
    );
}
