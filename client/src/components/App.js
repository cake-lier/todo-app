import { Component } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import { io } from "socket.io-client";
import Home from "../pages/publicPages/home/Home";
import Login from "../pages/publicPages/login/Login";
import MyDay from "../pages/userPages/myDay/MyDay";
import Signup from "../pages/publicPages/signup/Signup";
import Settings from "../pages/userPages/settings/Settings";
import Calendar from "../pages/userPages/calendar/Calendar";
import Join from "../pages/publicPages/join/Join";
import MyLists from "../pages/userPages/myLists/MyLists";
import SharedWithMe from "../pages/userPages/sharedWithMe/SharedWithMe";
import List from "../pages/userPages/list/List";
import Reports from "../pages/userPages/reports/Reports";
import Achievements from "../pages/userPages/achievements/Achievements";
import { NotificationsContext } from "../utils/contexts";
import LegalAdvisory from "../pages/publicPages/legalAdvisory/LegalAdvisory";
import Search from "../pages/userPages/search/Search";
import Error404 from "../pages/publicPages/error404/Error404";
import TermsAndCookies from "../pages/userPages/termsAndCookies/TermsAndCookies";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            anonymousId: null,
            notifications: [],
            notificationsUnread: false,
            hideCompleted: false,
            setNotificationsUnread: notificationsUnread => {
                this.setState({ notificationsUnread });
            },
            displayError: false,
            ready: false,
            socket: null
        };
        this.setUser = this.setUser.bind(this);
        this.unsetUser = this.unsetUser.bind(this);
        this.setAnonymousId = this.setAnonymousId.bind(this);
        this.unsetAnonymousId = this.unsetAnonymousId.bind(this);
        this.setNotifications = this.setNotifications.bind(this);
        this.setHideCompleted = this.setHideCompleted.bind(this);
    }

    setUser(user) {
        if (!this.state.user) {
            this.state
                .socket
                .on("userDataReload", () => axios.get("/users/me").then(user => this.setState({ user: user.data })));
            this.state
                .socket
                .on("achievementReload", () => axios.get("/users/me").then(user => this.setState({ user: user.data })));
            axios.get("/users/me/notifications")
                 .then(
                     notificationsResponse => {
                         this.setState({
                             notifications: notificationsResponse.data,
                             notificationsUnread: notificationsResponse.data.length > 0
                         });
                     }
                 );
            this.setState({ anonymousId: null });
        }
        this.setState({ user });
    }

    unsetUser() {
        this.setState({
            notificationsUnread: false,
            hideCompleted: false
        });
        if (this.state.socket !== null) {
            this.state.socket.disconnect();
        }
        const socket = io();
        socket.on("joinRequest", listId => socket.emit("joinApproval", socket.id, listId, false));
        socket.on(
            "connect",
            () => axios.post("/socket", { socketId: socket.id })
                       .then(
                           _ => this.setState({
                               user: null,
                               socket
                           }),
                           _ => this.setState({ displayError: true })
                       )
        );
    }

    setAnonymousId(anonymousId) {
        this.setState({ anonymousId });
    }

    unsetAnonymousId() {
        if (this.state.socket !== null) {
            this.state.socket.disconnect();
        }
        const socket = io();
        socket.on("joinRequest", listId => socket.emit("joinApproval", socket.id, listId, false));
        socket.on(
            "connect",
            () => axios.post("/socket", { socketId: socket.id })
                .then(
                    _ => this.setState({
                        anonymousId: null,
                        socket
                    }),
                    _ => this.setState({ displayError: true })
                )
        );
    }

    setNotifications(notifications) {
        this.setState({ notifications });
    }

    setHideCompleted(hideCompleted) {
        this.setState({ hideCompleted });
    }

    componentDidMount() {
        const socket = io();
        socket.on(
            "joinRequest",
            (listId, listTitle, username, anonymousSocketId) =>
                socket.emit("joinApproval", socket.id, listId, anonymousSocketId, false)
        );
        socket.on("connect", () => {
            axios.post("/socket", { socketId: socket.id })
                 .then(_ => axios.get("/users/me"))
                 .then(userResponse => {
                     const user = userResponse.data;
                     socket.on("userDataReload", () => axios.get("/users/me").then(user => this.setUser(user.data)));
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
            <NotificationsContext.Provider value={ this.state }>
                <Dialog
                    dismissableMask={ true }
                    draggable={ false }
                    resizable={ false }
                    footer={<div className="grid"><br/><br/></div>}
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
                        element={
                            this.state.user === null
                            ? <Join socket={ this.state.socket } setAnonymousId={ this.setAnonymousId } />
                            : <Navigate to="/my-day" />
                        }
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
                                  unsetUser={ this.unsetUser }
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
                                  unsetUser={ this.unsetUser }
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
                    <Route
                        path="/achievements"
                        element={
                            this.state.user !== null
                                ? <Achievements
                                    user={ this.state.user }
                                    unsetUser={ this.unsetUser }
                                    notifications={ this.state.notifications }
                                    setNotifications={ this.setNotifications }
                                    socket={ this.state.socket }
                                />
                                : <Navigate to="/" />
                        }
                    />
                    <Route
                        exact path="/my-lists"
                        element={
                            this.state.user !== null
                                ? <MyLists
                                    setUser={this.setUser}
                                    user={ this.state.user }
                                    unsetUser={ this.unsetUser }
                                    notifications={ this.state.notifications }
                                    setNotifications={ this.setNotifications }
                                    socket={ this.state.socket }
                                  />
                                : <Navigate to="/" />
                        }
                    />
                    <Route
                        exact path="/shared-with-me"
                        element={
                            this.state.user !== null
                                ? <SharedWithMe
                                    setUser={this.setUser}
                                    user={ this.state.user }
                                    unsetUser={ this.unsetUser }
                                    notifications={ this.state.notifications }
                                    setNotifications={ this.setNotifications }
                                    socket={ this.state.socket }
                                  />
                                : <Navigate to="/" />
                        }
                    />
                    <Route path="/list" element={ <Navigate to="/my-lists" /> } />
                    <Route
                        path="/list/:id"
                        element={
                            this.state.user !== null || this.state.anonymousId !== null
                            ? <List
                                user={ this.state.user }
                                anonymousId={ this.state.anonymousId }
                                unsetAnonymousId={ this.unsetAnonymousId }
                                setUser={ this.setUser }
                                unsetUser={ this.unsetUser }
                                notifications={ this.state.notifications }
                                setNotifications={ this.setNotifications }
                                hideCompleted={ this.state.hideCompleted }
                                setHideCompleted={ this.setHideCompleted }
                                socket={ this.state.socket }
                              />
                            : <Navigate to="/"/>
                        }
                    />
                    <Route path="/reports" element={ <Navigate to="/reports/completion-rate" /> } />
                    <Route
                        path="/reports/completion-rate"
                        element={
                            this.state.user !== null
                            ? <Reports
                                  user={ this.state.user }
                                  setUser={ this.setUser }
                                  unsetUser={ this.unsetUser }
                                  tab="completion-rate"
                                  socket={ this.state.socket }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/reports/items-completed"
                        element={
                            this.state.user !== null
                            ? <Reports
                                  user={ this.state.user }
                                  setUser={ this.setUser }
                                  unsetUser={ this.unsetUser }
                                  tab="items-completed"
                                  socket={ this.state.socket }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/legal"
                        element={
                            this.state.user !== null
                            ? <TermsAndCookies
                                  user={ this.state.user }
                                  unsetUser={ this.unsetUser }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                              />
                            : <Navigate to="/" />
                        }
                    />
                    <Route
                        path="/legal/terms-and-conditions"
                        element={ this.state.user === null ? <LegalAdvisory displayTerms={ true } /> : <Navigate to="/legal" /> }
                    />
                    <Route
                        path="/legal/cookie-policy"
                        element={ this.state.user === null ? <LegalAdvisory displayTerms={ false } /> : <Navigate to="/legal" /> }
                    />
                    <Route
                        path="/search"
                        element={
                            this.state.user !== null
                            ? <Search
                                  user={ this.state.user }
                                  unsetUser={ this.unsetUser }
                                  notifications={ this.state.notifications }
                                  setNotifications={ this.setNotifications }
                                  socket={ this.state.socket }
                              />
                              : <Navigate to="/"/>
                        }
                    />
                    <Route path="*" element={ <Error404 /> } />
                </Routes>
            </NotificationsContext.Provider>
        );
    }
}

export default App;
