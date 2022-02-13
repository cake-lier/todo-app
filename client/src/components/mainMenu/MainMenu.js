import { Menu } from 'primereact/menu';
import { PrimeIcons } from 'primereact/api';
import { useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import "./MainMenu.scss";

export default function MainMenu({ selected }) {
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
        {
            label: "My lists",
            icon: PrimeIcons.LIST,
            disabled: selected === "My lists",
            command: useOnClicked("my-lists")
        },
        {
            label: "Shared with me",
            icon: PrimeIcons.USERS,
            disabled: selected === "Shared with me",
            command: useOnClicked("shared-with-me")
        },
        {
            label: "Calendar",
            icon: PrimeIcons.CALENDAR,
            disabled: selected === "Calendar",
            command: useOnClicked("calendar")
        },
        {
            label: "Reports",
            icon: PrimeIcons.CHART_BAR,
            disabled: selected === "Reports",
            command: useOnClicked("reports")
        },
        {
            label: "Achievements",
            icon: PrimeIcons.STAR,
            disabled: selected === "Achievements",
            command: useOnClicked("achievements")
        }
    ];

    const subItems = [
        {
            label: "Search",
            icon: PrimeIcons.SEARCH,
            disabled: selected === "Search",
            command: useOnClicked("search")
        },
        {
            label: "Settings",
            icon: PrimeIcons.COG,
            disabled: selected === "Settings",
            command: useOnClicked("settings")
        },
        {
            label: "Terms and Cookies",
            icon: PrimeIcons.BARS,
            disabled: selected === "Terms and Cookies",
            command: useOnClicked("legal")
        }
    ];

    return (
        <div className="grid h-full w-min align-content-between"
             style={{backgroundColor: "#FFF", borderRight: "1px solid lightgrey"}}>
            <div className="col-12 p-0 flex">
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" model={ mainItems } />
            </div>
            <div className="col-12 p-0 flex">
                <Menu id="mainMenu" className="border-none p-0 flex-shrink-1 border-noround" model={ subItems } />
            </div>
        </div>
    );
}
