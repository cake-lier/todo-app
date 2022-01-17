import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/home/Home";
import axios from "axios";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        };
    }

    componentDidMount() {
       axios.get("/users/me")
            .then(
                response => {
                    this.setState({
                        user: response.data
                    });
                },
                error => {
                    //TODO: toast for non login required errors
                }
            );
    }

    render() {
        return (
            <Routes>
                <Route path="/" element={ this.state.user !== null ? <Navigate to="/home" /> : <Home /> } />
                {/*<Route path="/login" element={ <Login /> } />*/}
            </Routes>
        );
    }
}

export default App;
