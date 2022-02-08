import {useCallback, useEffect, useRef, useState} from "react";
import {useOnClickOutside} from "../../components/ClickOutsideHook";
import axios from "axios";
import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import {Divider} from "primereact/divider";
import _ from "lodash";
import "./Achievements.scss";

export default function Achievements({ user, unsetUser, socket, notifications, setNotifications }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [open, setOpen] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    };
    const [achievements, setAchievements] = useState([]);
    const updateAchievements = useCallback(() => {
        axios.get("/users/me/achievements")
            .then(
                achievements => setAchievements(achievements.data),
                error => displayError(error.response.data.error)
            );
    }, [setAchievements, displayError]);
    useEffect(updateAchievements, [updateAchievements]);
    useEffect(() => {
        function handleUpdates(event) {
            if (event === "achievementGotReload") {
                updateAchievements();
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [socket, updateAchievements]);
    const achievementsNames = [
        "6 months of Waffles",
        "1 year of Waffles",
        "2 years of Waffles",
        "5 items completed",
        "10 items completed",
        "25 items completed",
        "50 items completed",
        "100 items completed",
        "150 items completed",
        "200 items completed",
        "You visited the reports page",
        "Your first collaboration",
        "Your first list",
        "Your first item"
    ];
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="achievementsMainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Achievements" } open={ true } />
            </div>
            <div id="reportsMainMenuContainer" className="mx-0 p-0 h-full absolute flex justify-content-center md:hidden">
                <div className="h-full w-full" ref={ node } style={ divStyle }>
                    <BurgerMenu open={ open } setOpen={ setOpen } />
                    <MainMenu selected={ "Achievements" } open={ open } />
                </div>
            </div>
            <div id="achievementsPageContainer" className="mx-0 p-0 flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Achievements" }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-column flex-grow-1 overflow-y-auto">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-12">
                        <div className="grid">
                            {
                                _.range(0, 14).map(index =>
                                    <div className="col-3 px-5 lg:col-2 lg:px-5 xl:px-6" style={{ overflowWrap: "break-word" }}>
                                        <img
                                            src={ `/static/images/achievements/${ index }.png` }
                                            alt={ achievementsNames[index] }
                                            className={ "w-full " + (achievements[index] ? "" : "achievementDisabled") }
                                        />
                                        <p className="mt-3 text-lg text-center">{ achievementsNames[index] }</p>
                                        {
                                            achievements[index]
                                                ? <p className="text-lg text-center">
                                                    Achievement unlocked on { new Date(achievements[index]).toLocaleDateString("en-GB") }
                                                </p>
                                                : null
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div id="achievementsPageContainer" className="mx-0 p-0 flex flex-column w-full flex-1 md:hidden">
                <div className={"black-overlay absolute h-full w-full z-5 " + (open ? null : "hidden")} />
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Achievements" }
                    isResponsive={ true }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-column flex-grow-1 overflow-y-auto">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-12 flex flex-wrap">
                        {
                            _.range(0, 14).map(index =>
                                <div className="col-4 sm:col-3 px-5">
                                    <img
                                        src={ `/static/images/achievements/${ index }.png` }
                                        alt={ achievementsNames[index] }
                                        className={ "w-full " + (achievements[index] ? "" : "achievementDisabled") }
                                    />
                                    <p className="mt-3 text-lg text-center" style={{ overflowWrap: "break-word" }}>
                                        { achievementsNames[index] }
                                    </p>
                                    {
                                        achievements[index]
                                            ? <p className="text-lg text-center">
                                                Achievement unlocked on { new Date(achievements[index]).toLocaleDateString("en-GB") }
                                            </p>
                                            : null
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
