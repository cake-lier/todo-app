import ErrorMessages from "../../components/ErrorMessages";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import JoinDialog from "../../components/joinDialog/JoinDialog";
import {ItemsContainer} from "../../components/item/itemsContainer/ItemsContainer";

export default function List({ user, unsetUser, notifications, setNotifications, socket }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const node = useRef();
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    };
    const getTitle = useCallback(() => {
        axios.get(`/lists/${ id }`)
            .then(
                list => setTitle(list.data.title),
                error => displayError(error.response.data.error)
            );
    }, [id, setTitle, displayError]);
    useEffect(getTitle, [getTitle]);
    const navigate = useNavigate();
    useEffect(() => {
        function handleUpdates(event, listId) {
            if (listId === id) {
                if (event === "listTitleChangedReload") {
                    getTitle();
                } else if (new RegExp("^list(?:Deleted|SelfRemoved)Reload$").test(event)) {
                    navigate("/my-day");
                }
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [id, socket, getTitle, navigate]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <JoinDialog listId={ id } socket={ socket } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My lists" } open={ true } />
            </div>
            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 flex-grow-1 hidden md:block">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ title }
                    showDate={ false }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <ItemsContainer listId={ id } />
            </div>
            <div className="w-full p-0 md:hidden"  style={{backgroundColor: "white"}} >
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "My day" } open={open}/>
                    </div>
                </div>
                <div id="myListsContainer" className="mx-0 p-0 w-full md:block">
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title={ title }
                        showDate={ false }
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <ItemsContainer listId={ id } />
                </div>
            </div>
        </div>
    );
}

