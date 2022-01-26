import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import MyDay from "../pages/myDay/MyDay";
import Signup from "../pages/signup/Signup";
import MyLists from "../pages/myLists/MyLists";
import SharedWithMe from "../pages/sharedWithMe/SharedWithMe";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            displayError: false,
            ready: false
        };
        this.setUser = this.setUser.bind(this);
        this.unsetUser = this.unsetUser.bind(this);
    }

    setUser(user) {
        this.setState({ user });
    }

    unsetUser() {
        this.setState({ user: null });
    }

    componentDidMount() {
       axios.get("/users/me")
            .then(
                response => this.setState({
                    user: response.data,
                    ready: true
                }),
                error => this.setState({
                    displayError: error.response.data.error !== 3,
                    ready: true
                })
            );
    }

    render() {
        if (!this.state.ready) {
            return null;
        }
        return (
            <>
                <Dialog
                    header={ <h2>It seems quite an error to me.</h2> }
                    visible={ this.state.displayError }
                    onHide={ () => this.setState({ displayError: false }) }>
                    <p>If you're seeing this message, probably something went wrong with the site. Something that should never
                        happen has just happened, so here's that.</p>
                    <p> If you feel kind enough, please report this error to the developers of this website, they'll welcome you.
                        If not, just stick around for a bit, the time needed to fix this problem, and we'll be back to you.</p>
                </Dialog>
                <Routes>
                    <Route path="/" element={ this.state.user === null ? <Home /> : <Navigate to="/my-day" /> } />
                    <Route
                        path="/login"
                        element={ this.state.user === null ? <Login setUser={ this.setUser } /> : <Navigate to="/my-day" /> }
                    />
                    <Route
                        path="/signup"
                        element={ this.state.user === null ? <Signup setUser={ this.setUser } /> : <Navigate to="/my-day" /> }
                    />
                    <Route
                        path="/my-day"
                        element={
                            this.state.user !== null
                            ? <MyDay user={ this.state.user } unsetUser={ this.unsetUser } />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/my-lists"
                        element={
                            this.state.user !== null
                            ? <MyLists user={ this.state. user } unsetUser={ this.unsetUser } />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/shared-with-me"
                        element={
                            this.state.user !== null
                            ? <SharedWithMe user={this.state.user} unsetUser={this.unsetUser }/>
                            : <Navigate to="/" />
                        }
                    />
                </Routes>
            </>
        );
    }
}

export default App;
