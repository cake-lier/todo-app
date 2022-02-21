import { Card } from 'primereact/card';
import TermsOfService from "../components/TermsOfService";
import CookiePolicy from "../components/CookiePolicy";
import { useNavigate } from "react-router-dom";
import {Button} from "primereact/button";
import { useCallback, useRef } from "react";
import ErrorMessages from "../components/ErrorMessages";
import MainMenu from "../components/mainMenu/MainMenu";
import PageHeader from "../components/pageHeader/PageHeader";
import {Divider} from "primereact/divider";

export default function LegalAdvisory({ user, unsetUser, notifications, setNotifications, socket, displayTerms }) {
    const navigate = useNavigate();
    const goHome = useCallback(() => {
        navigate("/");
    }, [navigate]);
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    if (user) {
        return (
            <div className="grid h-screen">
                <ErrorMessages ref={ errors } />
                <div id="mainMenuContainer" className="h-screen mx-0 p-0 hidden md:block">
                    <MainMenu selected={ "Terms and Cookies" } open={ true } />
                </div>
                <div id="pageContainer" className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex" style={{ backgroundColor: "#FFF" }}>
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
    return (
        <div className="grid h-screen align-items-center">
            <div className="col-12 md:col-4 md:col-offset-4 lg:col-6 lg:col-offset-3">
                <Card
                    title={
                        <>
                            <div className="col-12 flex justify-content-center">
                                <img className="h-5rem" src="/images/logo512.png" alt="App logo"/>
                            </div>
                            <div className="col-12 px-0">
                                <h1>{displayTerms ? "Waffles' Terms of Service" : "Waffles' Cookie Policy"}</h1>
                            </div>
                        </>
                    }
                    header={ <Button icon="pi pi-arrow-left" className="m-3" label="Home" onClick={ goHome } /> }
                >
                    { displayTerms ? <TermsOfService className="text-xl" /> : <CookiePolicy className="text-xl" /> }
                </Card>
            </div>
        </div>
    );
}
