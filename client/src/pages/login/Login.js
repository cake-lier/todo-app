import { Component } from "react";
import { Card } from 'primereact/card';
import LoginForm from "../../components/LoginForm";

class Login extends Component {

    render() {
        return (
            <div className="grid h-screen align-items-center">
                <div className="col-4 col-offset-4 hidden md:block">
                    <Card>
                        <LoginForm />
                    </Card>
                </div>
                <div className="col-12 md:hidden">
                    <LoginForm />
                </div>
            </div>
        );
    }
}

export default Login;
