import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { io } from "socket.io-client";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import MyDay from "../pages/myDay/MyDay";
import Signup from "../pages/signup/Signup";
import Settings from "../pages/settings/Settings";
import Calendar from "../pages/calendar/Calendar";
import { TestList } from "./list/TestList";
import Join from "../pages/join/Join";
import MyLists from "../pages/myLists/MyLists";
import SharedWithMe from "../pages/sharedWithMe/SharedWithMe";
import List from "../pages/list/List";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            notifications: [],
            displayError: false,
            ready: false,
            socket: null
        };
        this.setUser = this.setUser.bind(this);
        this.unsetUser = this.unsetUser.bind(this);
        this.setNotifications = this.setNotifications.bind(this);
    }

    setUser(user) {
        this.setState({ user });
    }

    unsetUser() {
        if (this.state.socket !== null) {
            this.state.socket.disconnect();
        }
        const socket = io();
        socket.on("joinRequest", listId => socket.emit("joinApproval", socket.id, listId, false));
        socket.on("connect", () =>
            axios.post(
                "/socket",
                {
                    socketId: socket.id
                }
            )
            .then(
                _ => this.setState({
                    user: null,
                    socket
                }),
                _ => this.setState({ displayError: true })
            )
        );
    }

    setNotifications(notifications) {
        this.setState({ notifications });
    }

    componentDidMount() {
        const socket = io();
        socket.on("joinRequest", listId => socket.emit("joinApproval", socket.id, listId, false));
        socket.on("connect", () => {
            axios.post(
                "/socket",
                {
                    socketId: socket.id
                }
            )
            .then(_ => axios.get("/users/me"))
            .then(userResponse => {
                const user = userResponse.data;
                axios.get("/users/me/notifications")
                     .then(
                         notificationsResponse => this.setState({
                             socket,
                             user,
                             notifications: notificationsResponse.data,
                             ready: true
                         }),
                         _ => this.setState({
                             socket,
                             user,
                             displayError: true,
                             ready: true
                         })
                     );
            })
            .catch(error => this.setState({
                socket,
                displayError: error.response.data.error !== 3,
                ready: true
            }));
        });
    }

    componentWillUnmount() {
        if (this.state.socket !== null) {
            this.state.socket.disconnect();
        }
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
                        path="/join"
                        element={ this.state.user === null ? <Join socket={ this.state.socket } /> : <Navigate to="/my-day" /> }
                    />
                    <Route
                        path="/my-day"
                        element={
                            this.state.user !== null
                            ? <MyDay
                                  user={ this.state.user }
                                  unsetUser={ this.unsetUser }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                                />
                            : <Navigate to="/" />
                        }
                    />
                    <Route path="/settings" element={ <Navigate to="/settings/account" /> } />
                    <Route
                        path="/settings/account"
                        element={
                            this.state.user !== null
                            ? <Settings
                                    user={ this.state.user }
                                    unsetUser={ this.unsetUser }
                                    setUser={ this.setUser }
                                    notifications={ this.state.notifications }
                                    setNotifications={ this.setNotifications }
                                    socket={ this.state.socket }
                                    tab="account"
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/settings/password"
                        element={
                            this.state.user !== null
                            ? <Settings
                                  user={ this.state.user }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                                  tab="password"
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/settings/notifications"
                        element={
                            this.state.user !== null
                            ? <Settings
                                  user={ this.state.user }
                                  setUser={ this.setUser }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                                  tab="notifications"
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            this.state.user !== null
                            ? <Calendar
                                  user={ this.state.user }
                                  unsetUser={ this.unsetUser }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route  // for testing
                        path="/test-list"
                        element={<TestList name="School things" socket={ this.state.socket }/>}
                    />
                    <Route
                        exact path="/my-lists"
                        element={
                            this.state.user !== null
                                ? <MyLists user={ this.state.user } unsetUser={ this.unsetUser } socket={ this.state.socket } />
                                : <Navigate to="/" />
                        }
                    />
                    <Route
                        exact path="/shared-with-me"
                        element={
                            this.state.user !== null
                                ? <SharedWithMe
                                    user={ this.state.user }
                                    unsetUser={ this.unsetUser }
                                    socket={ this.state.socket }
                                  />
                                : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/my-lists/:id"
                        element={
                            this.state.user !== null
                            ? <List user={this.state.user} unsetUser={ this.unsetUser } socket={ this.state.socket } />
                            : <Navigate to="/"/>
                        }
                    />
                </Routes>
            </>
        );
    }
}

export default App;
