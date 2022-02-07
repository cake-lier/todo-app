import ErrorMessages from "../../components/ErrorMessages";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import JoinDialog from "../../components/joinDialog/JoinDialog";
import {ItemsContainer} from "../../components/item/itemsContainer/ItemsContainer";

export default function List(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const { id } = useParams();
    const [title, setTitle] = useState("");
    useEffect( () => {
        axios.get(`/lists/${ id }`)
             .then(
                 list => {
                     setTitle(list.data.title);
                 },
                 error => displayError(error.response.data.error)
             );
    },[id, displayError])
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <JoinDialog listId={ id } socket={ props.socket } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My day" } open={true}/>
            </div>
            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 flex-1 hidden md:block">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ title }
                    showDate={ false }
                    isResponsive={ false }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    displayError={ displayError }
                />
                <ItemsContainer listId={id} />
            </div>
            <div className="w-full p-0 md:hidden"  style={{backgroundColor: "white"}} >
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ title }
                    showDate={ false }
                    isResponsive={ true }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    displayError={ displayError }
                />
                <ItemsContainer listId={id} />
            </div>
        </div>
    );
}

