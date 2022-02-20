import { useCallback, useRef } from "react";
import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import _ from "lodash";
import "./Achievements.scss";

export default function Achievements({ user, unsetUser, socket, notifications, setNotifications }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
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
            <div id="achievementsPageContainer" className="mx-0 p-0 flex-column flex-1 hidden md:flex h-screen">
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
                <div className="grid justify-content-center align-content-start overflow-y-auto h-full">
                        {
                            _.range(0, 14).map(index =>
                                <div
                                    key={index}
                                    className="w-10rem p-3"
                                    style={{ overflowWrap: "break-word" }}
                                >
                                    <img
                                        src={ `/static/images/achievements/${ index }.png` }
                                        alt={ achievementsNames[index] }
                                        className={ "w-full " + (user.achievements[index] ? "" : "achievementDisabled") }
                                    />
                                    <p className="mt-3 text-md text-center font-semibold">"{ achievementsNames[index] }"</p>
                                    {
                                        user.achievements[index]
                                            ? <p className="text-md text-center">
                                                Unlocked on { new Date(user.achievements[index]).toLocaleDateString("en-GB") }
                                            </p>
                                            : null
                                    }
                                </div>
                            )
                        }
                </div>
            </div>
            <div id="achievementsPageContainer" className="mx-0 p-0 flex flex-column w-full flex-1 md:hidden">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="Achievements"
                    isResponsive={ true }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-grow-1 justify-content-center align-content-start">
                    {
                        _.range(0, 14).map(index =>
                            <div key={index} className="w-10rem p-3">
                                <img
                                    src={ `/static/images/achievements/${ index }.png` }
                                    alt={ achievementsNames[index] }
                                    className={ "w-full " + (user.achievements[index] ? "" : "achievementDisabled") }
                                />
                                <p className="mt-3 text-md text-center font-semibold" style={{ overflowWrap: "break-word" }}>
                                    "{ achievementsNames[index] }"
                                </p>
                                {
                                    user.achievements[index]
                                    ? <p className="text-md text-center">
                                          Unlocked on { new Date(user.achievements[index]).toLocaleDateString("en-GB") }
                                      </p>
                                    : null
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}
