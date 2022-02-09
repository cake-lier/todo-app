import { useCallback, useRef } from "react";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import ErrorMessages from "../../components/ErrorMessages";
import "./MyDay.scss";
import PageHeader from "../../components/pageHeader/PageHeader";
import MyDayItem from "../../components/myDayItem/MyDayItem";

export default function MyDay(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block sticky top-0">
                <MainMenu selected={ "My day" } open={ true } />
            </div>
            <div id="my-day-container"
                 className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex"
                 style={{ backgroundColor: "white" }}>
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title="My Day"
                    showDate={ true }
                    isResponsive={ false }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    displayError={ displayError }
                />
                <div className="grid h-full overflow-y-auto">
                    <MyDayItem socket={ props.socket } displayError={ displayError } />
                </div>
            </div>
            <div className="w-full p-0 md:hidden">
                <div id="my-day-container-mobile"
                     className="mx-0 p-0 w-full h-full md:block"
                     style={{ backgroundColor: "white" }}
                >
                    <PageHeader
                        user={ props.user }
                        unsetUser={ props.unsetUser }
                        title="My day"
                        showDate={ true }
                        isResponsive={ true }
                        notifications={ props.notifications }
                        setNotifications={ props.setNotifications }
                        socket={ props.socket }
                        displayError={ displayError }
                    />
                    <div className="grid overflow-y-auto">
                        <MyDayItem socket={ props.socket } displayError={ displayError } />
                    </div>
                </div>
            </div>
        </div>
    );
}

