import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import UserHome from "../pages/userhome/UserHome";

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
                <Route path="/" element={ this.state.user === null ? <Home /> : <Navigate to="/home" /> } />
                <Route
                    path="/login"
                    element={
                        this.state.user === null
                        ? <Login setUser={ this.setUser } lastErrorCode={ this.state.lastErrorCode } />
                        : <Navigate to="/home" />
                    }
                />
                <Route
                    path="/signup"
                    element={ null }
                />
                <Route
                    path="/logout"
                    element={ null }
                />
                <Route
                    path="/home"
                    element={ this.state.user !== null ? <UserHome user={ this.state.user } /> : <Navigate to="/" /> }
                />
            </Routes>
        );
    }
}

export default App;
