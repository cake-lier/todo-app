import { Component } from "react";
import LinkButton from "../../components/LinkButton";
import "./Home.css";

class Home extends Component {

    render() {
        return (
            <div className="grid home-body h-screen">
                <div className="hidden md:block md:col-12">
                    <div className="grid">
                        <div className="col-1">
                            <img className="w-5rem" src="images/logo512.png" alt="App logo" />
                        </div>
                        <div className="col-1 flex align-items-center">
                            <h1 className="text-5xl font-bold m-0">Waffles</h1>
                        </div>
                        <div className="col-1 col-offset-8 flex justify-content-center align-items-center">
                            <LinkButton className="text-lg p-button-outlined login-button" label="Log in" route="login" />
                        </div>
                        <div className="col-1 flex justify-content-center align-items-center">
                            <LinkButton className="text-lg" label="Sign up" route="signup" />
                        </div>
                    </div>
                </div>
                <div className="md:hidden col-12 h-5rem flex justify-content-center">
                    <img className="h-5rem" src="images/logo512.png"  alt="App logo" />
                </div>
                <div className="col-12">
                    <div className="grid">
                        <div className="col-12 md:col-3 col-offset-0 md:col-offset-1">
                            <h1 className="text-5xl md:text-7xl font-bold">Upgrade your</h1>
                            <h1 className="text-5xl md:text-7xl font-bold">productivity.</h1>
                            <h2 className="text-xl md:text-3xl mt-5">Plan, organize, get things done.</h2>
                        </div>
                    </div>
                </div>
                <div className="md:hidden col-12 absolute bottom-0">
                    <div className="grid">
                        <div className="col-4 col-offset-1">
                            <LinkButton className="text-lg p-button-outlined login-button" label="Log in" route="login" />
                        </div>
                        <div className="col-4 col-offset-2 flex justify-content-end">
                            <LinkButton className="text-lg" label="Sign up" route="signup" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
