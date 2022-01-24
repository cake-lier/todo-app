import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import {useRef, useState} from "react";
import CreationHeader from "../../components/creationHeader/CreationHeader";
import ListItem from "../../components/listItem/ListItem";
import {Divider} from "primereact/divider";

function MyLists(props) {

    const displayError = (lastErrorCode) => {
        props.errors.displayError(lastErrorCode);
    }

    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState(null);
    const node = useRef();

    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    }

    return(
        <div className="grid h-screen">
            <ErrorMessages {...props} errors = {props.errors}/>

            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My day" } open={true}/>
            </div>

            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 flex-grow-1 hidden md:block">
                <PageHeader
                    props={props}
                    title="My Lists"
                    showDate={false}
                    isResponsive={false}
                    displayError={displayError}
                />
                <CreationHeader
                    title="Add new list"
                    lists={lists}
                    setLists={setLists}
                />

                <Divider className={!lists || lists.length == 0? "hidden" : "m-0 p-0"} />

                <ListItem
                    lists={lists}
                    setLists={setLists}
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
                        title="My Lists"
                        showDate={false}
                        isResponsive={true}
                        displayError={displayError}
                    />
                    <CreationHeader
                        title="Add new list"
                    />

                    <Divider className={!lists || lists.length == 0? "hidden" : "m-0 p-0"} />

                    <ListItem
                        lists={lists}
                        setLists={setLists}
                    />
                </div>
            </div>
        </div>
    );

}

export default MyLists;

