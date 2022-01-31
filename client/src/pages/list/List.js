import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import {useEffect, useRef, useState} from "react";
import {Divider} from "primereact/divider";
import {useParams} from "react-router-dom";
import axios from "axios";

function Lists(props) {

    const displayError = (lastErrorCode) => {
        props.errors.displayError(lastErrorCode);
    }

    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [open, setOpen] = useState(false);
    const node = useRef();

    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    }

    useEffect( () => {
            axios.get(
                `/lists/${id}`
            ).then(
                r =>{
                    setTitle(r.data.title);
                    console.log(r)
                }
            )
    },[])

    return(
        <div className="grid h-screen">
            <ErrorMessages {...props} errors = {props.errors}/>

            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My day" } open={true}/>
            </div>

            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 flex-grow-1 hidden md:block">
                <PageHeader
                    props={props}
                    title={title}
                    showDate={false}
                    isResponsive={false}
                    displayError={displayError}
                />
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
                        props={props}
                        title={title}
                        showDate={false}
                        isResponsive={true}
                        displayError={displayError}
                    />
                </div>
            </div>
        </div>
    );

}

export default Lists;

