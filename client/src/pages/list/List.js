import ErrorMessages from "../../components/ErrorMessages";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {ItemsContainer} from "../../components/itemsContainer/ItemsContainer";

export default function List(props) {
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
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My day" } open={true}/>
            </div>
            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 flex-grow-1 hidden md:block">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title={ title }
                    showDate={ false }
                    isResponsive={ false }
                    displayError={ displayError }
                />
                <ItemsContainer listId={id} listTitle={title} />
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
                        user={ props.user }
                        unsetUser={ props.unsetUser }
                        title={ title }
                        showDate={ false }
                        isResponsive={ true }
                        displayError={ displayError }
                    />
                </div>
            </div>
        </div>
    );
}

