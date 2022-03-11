import axios from "axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";

export default function LoginForm({ setUser, displayError }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const doLogin = useCallback(e => {
        e.preventDefault();
        setIsSubmitting(true);
        axios.post("users/me/session", { email, password })
             .then(
                 user => setUser(user.data),
                 error => {
                     if (error.response.data.error === 1) {
                         setLoginFailed(true);
                     }
                     setIsSubmitting(false);
                     displayError(error.response.data.error);
                 }
             );
    }, [setIsSubmitting, email, password, setLoginFailed, setUser, displayError]);
    return (
        <div className="grid">
            <div className="col-12 flex justify-content-center">
                <img className="h-5rem" src="/images/logo512.png"  alt="App logo" />
            </div>
            <div className="col-12 mt-5">
                <h1 className="font-bold text-4xl">Log in</h1>
                <h3 className="text-xl mt-3">Welcome back to Waffles</h3>
            </div>
            <div className="col-12 mt-3">
                <form onSubmit={ doLogin } >
                    <span className="p-float-label p-input-icon-right w-full">
                        <i className="pi pi-envelope" />
                        <InputText
                            id="email"
                            name="email"
                            className={ "w-full" + (loginFailed ? " p-invalid" : "") }
                            value={ email }
                            onChange={ e => setEmail(e.target.value) }
                        />
                        <label htmlFor="email" className={ loginFailed ? "p-error" : "" }>E-mail</label>
                    </span>
                    <span className="p-float-label mt-2">
                        <Password
                            id="password"
                            name="password"
                            className={ "w-full" + (loginFailed ? " p-invalid" : "") }
                            value={ password }
                            onChange={ e => setPassword(e.target.value) }
                            feedback={ false }
                            toggleMask
                        />
                        <label htmlFor="password" className={ loginFailed ? "p-error" : "" }>Password</label>
                    </span>
                    <p className={ "text-sm p-error mt-2" + (loginFailed ? "" : " hidden") }>
                        Email or password are incorrect.
                    </p>
                    <Button disabled={ isSubmitting } type="submit" className="w-full mt-5" label="Login" />
                </form>
                <div className="flex justify-content-center mt-5">
                    <span>Not from around here? <Link to="/signup">Sign up</Link>.</span>
                </div>
            </div>
        </div>
    );
}
