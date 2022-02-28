import TermsOfService from "../../../components/termsOfService/TermsOfService";
import CookiePolicy from "../../../components/cookiePolicy/CookiePolicy";
import { useCallback, useRef } from "react";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import {Divider} from "primereact/divider";

export default function TermsAndCookies({ user, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="h-screen mx-0 p-0 hidden md:block">
                <SideMenu selected={ "Terms and Cookies" } open={ true } />
            </div>
            <div
                id="pageContainer"
                className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex"
                style={{ backgroundColor: "#FFF" }}
            >
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="Terms and Cookies"
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid overflow-y-auto flex flex-1">
                    <div className="col-12 md:px-5 lg:px-8 mt-3">
                        <h1 className="text-3xl mb-4 font-weight-bold">Waffles' Terms of Service</h1>
                        <TermsOfService className="text-xl" />
                        <Divider />
                        <h1 className="text-3xl mb-4 font-weight-bold">Waffles' Cookie Policy</h1>
                        <CookiePolicy className="text-xl" />
                    </div>
                </div>
            </div>
            <div className="w-full p-0 md:hidden">
                <div id="calendarPageContainer" className="mx-0 p-0 w-full md:block">
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title="Terms and Cookies"
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <div className="grid">
                        <div className="col-12 px-3 pt-3">
                            <h1 className="text-3xl mb-4 font-weight-bold">Waffles' Terms of Service</h1>
                            <TermsOfService className="text-xl" />
                            <Divider />
                            <h1 className="text-3xl mb-4 font-weight-bold">Waffles' Cookie Policy</h1>
                            <CookiePolicy className="text-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
