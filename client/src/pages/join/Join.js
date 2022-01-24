import { Component } from "react";
import { Card } from "primereact/card";
import OTPInput from "otp-input-react";
import ErrorMessages from "../../components/ErrorMessages";
import { Button } from "primereact/button";
import "./Join.scss";

class Join extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pinCode: "",
            isRequesting: false
        };
        this.displayError = this.displayError.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    displayError(lastErrorCode) {
        this.errors.displayError(lastErrorCode);
    }

    handleOnSubmit(e) {
        e.preventDefault();
        this.setState({
            isRequesting: true
        });
        //send message over socket -- create socket?
    }

    render() {
        return (
            <div className="grid h-screen align-items-center">
                <ErrorMessages ref={ e => this.errors = e } />
                <div className="col-12 md:col-4 md:col-offset-4">
                    <Card>
                        <div className="grid">
                            <div className="col-12 flex justify-content-center">
                                <img className="h-5rem" src="images/logo512.png"  alt="App logo" />
                            </div>
                            <div className="col-12 mt-5">
                                <h1 className="font-bold text-4xl">Insert the joining code</h1>
                                <h3 className="text-xl mt-3">Be ready for collaborating!</h3>
                            </div>
                            <div className="col-12 mt-5">
                                <form onSubmit={ this.handleOnSubmit } className="grid justify-content-center">
                                    <OTPInput
                                        value={ this.state.pinCode }
                                        onChange={ pinCode => this.setState({ pinCode }) }
                                        autoFocus
                                        OTPLength={ 6 }
                                        className="border-round col-12 md:col-8 justify-content-between otpInput"
                                    />
                                    <Button
                                        disabled={ this.state.pinCode.length !== 6 || this.state.isRequesting }
                                        type="submit"
                                        className="col-12 mt-6"
                                        label="Join"
                                    />
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }
}

export default Join;
