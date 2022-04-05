import { Card } from 'primereact/card';
import TermsOfService from "../../../components/termsOfService/TermsOfService";
import CookiePolicy from "../../../components/cookiePolicy/CookiePolicy";
import { useNavigate } from "react-router-dom";
import {Button} from "primereact/button";
import { useCallback } from "react";

export default function LegalAdvisory({ displayTerms }) {
    const navigate = useNavigate();
    const goHome = useCallback(() => {
        navigate("/");
    }, [navigate]);
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
