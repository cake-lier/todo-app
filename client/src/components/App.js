import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import MyDay from "../pages/myDay/MyDay";
import Signup from "../pages/signup/Signup";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            lastErrorCode: null
        };
        this.setUser = this.setUser.bind(this);
    }

    setUser(user) {
        this.setState({
            user,
            lastErrorCode: null
        });
    }

    componentDidMount() {
       axios.get("/users/me")
            .then(
                response => this.setState({
                    user: response.data
                }),
                error => {
                    if (error.response.data.error !== 3) {
                        this.setState({
                            lastErrorCode: error.response.data.error
                        });
                    }
                }
            );
    }

    render() {
        return (
            <Routes>
                <Route path="/" element={ this.state.user === null ? <Home /> : <Navigate to="/my-day" /> } />
                <Route
                    path="/login"
                    element={
                        this.state.user === null
                        ? <Login setUser={ this.setUser } lastErrorCode={ this.state.lastErrorCode } />
                        : <Navigate to="/my-day" />
                    }
                />
                <Route
                    path="/signup"
                    element={
                        this.state.user === null
                        ? <Signup setUser={ this.setUser } lastErrorCode={ this.state.lastErrorCode } />
                        : <Navigate to="/my-day" />
                    }
                />
                <Route
                    path="/my-day"
                    element={ this.state.user !== null ? <MyDay user={ this.state.user } /> : <Navigate to="/" /> }
                />
            </Routes>
        );
    }
}

export default App;
