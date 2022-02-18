import { Card } from "primereact/card";
import LinkButton from "../components/LinkButton";

export default function Error404() {
    return (
        <div className="grid h-screen align-items-center justify-content-center">
            <div className="col-12 sm:col-10 md:col-8 lg:col-6">
                <Card>
                    <div className="grid px-5">
                        <div className="col-12 flex justify-content-center">
                            <img className="h-5rem" src="/images/logo512.png"  alt="App logo" />
                        </div>
                        <div className="col-12 my-5">
                            <h1 className="font-bold text-4xl">Uh Oh! You have followed a dead end!</h1>
                            <h3 className="text-xl mt-3">Let us get you outta here.</h3>
                        </div>
                        <LinkButton
                            label="Yes, please, send me home!"
                            className="col-12 mt-3"
                            route=""
                        />
                    </div>
                </Card>
            </div>
        </div>
    );
}
