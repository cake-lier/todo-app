import { useCallback, useEffect, useRef } from "react";
import axios from "axios";
import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import _ from "lodash";
import "./Achievements.scss";

export default function Achievements({ user, setUser, unsetUser, socket, notifications, setNotifications }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const updateAchievements = useCallback(() => {
        axios.get("/users/me")
             .then(
                 user => setUser(user.data),
                 error => displayError(error.response.data.error)
             );
    }, [setUser, displayError]);
    useEffect(() => {
        function handleUpdates(event) {
            if (event === "achievementReload") {
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
                    <div className="col-12">
                        <div className="grid">
                            {
                                _.range(0, 14).map(index =>
                                    <div
                                        key={index}
                                        className="col-3 px-5 lg:col-2 lg:px-5 xl:px-6"
                                        style={{ overflowWrap: "break-word" }}
                                    >
                                        <img
                                            src={ `/static/images/achievements/${ index }.png` }
                                            alt={ achievementsNames[index] }
                                            className={ "w-full " + (user.achievements[index] ? "" : "achievementDisabled") }
                                        />
                                        <p className="mt-3 text-lg text-center">{ achievementsNames[index] }</p>
                                        {
                                            user.achievements[index]
                                            ? <p className="text-lg text-center">
                                                Achievement unlocked on {
                                                    new Date(user.achievements[index]).toLocaleDateString("en-GB")
                                                }
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
                    <div className="col-12 flex flex-wrap">
                        {
                            _.range(0, 14).map(index =>
                                <div key={index} className="col-4 sm:col-3 px-5">
                                    <img
                                        src={ `/static/images/achievements/${ index }.png` }
                                        alt={ achievementsNames[index] }
                                        className={ "w-full " + (user.achievements[index] ? "" : "achievementDisabled") }
                                    />
                                    <p className="mt-3 text-lg text-center" style={{ overflowWrap: "break-word" }}>
                                        { achievementsNames[index] }
                                    </p>
                                    {
                                        user.achievements[index]
                                        ? <p className="text-lg text-center">
                                              Achievement unlocked on {
                                                  new Date(user.achievements[index]).toLocaleDateString("en-GB")
                                              }
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
