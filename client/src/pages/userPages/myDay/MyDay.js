import { useCallback, useRef } from "react";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import MyDayContainer from "../../../components/userPages/myDay/myDayContainer/MyDayContainer";

export default function MyDay(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block sticky top-0">
                <SideMenu selected={ "My day" } open={ true } />
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
                <MyDayContainer socket={ props.socket } displayError={ displayError } />
            </div>
            <div className="w-full p-0 md:hidden">
                <div id="my-day-container-mobile"
                     className="mx-0 p-0 h-full flex-column flex-1 flex"
                     style={{ backgroundColor: "white" }}>
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
                    <MyDayContainer socket={ props.socket } displayError={ displayError } />
                </div>
            </div>
        </div>
    );
}

