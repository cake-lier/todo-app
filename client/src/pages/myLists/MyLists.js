import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import {useRef, useState} from "react";
import MyListsHeader from "../../components/myListsHeader/MyListsHeader";
import ListItem from "../../components/listItem/ListItem";
import {Divider} from "primereact/divider";
import {useOnClickOutside} from "../../components/ClickOutsideHook";

function MyLists(props) {

    const displayError = (lastErrorCode) => {
        props.errors.displayError(lastErrorCode);
    }

    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));

    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    }

    return(
        <div className="grid h-screen">
            <ErrorMessages {...props} errors = {props.errors}/>

            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My lists" } open={true}/>
            </div>

            <div id="myListsContainer" style={{backgroundColor: "white"}} className="mx-0 p-0 h-full flex-column flex-grow-1 hidden md:flex">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title="My Lists"
                    showDate={false}
                    isResponsive={false}
                    displayError={displayError}
                />
                <MyListsHeader
                    lists={lists}
                    setLists={setLists}
                />

                <Divider className={!lists || lists.length === 0? "hidden" : "m-0 p-0"} />

                <ListItem
                    lists={lists}
                    setLists={setLists}
                />
            </div>

            <div className="w-full p-0 md:hidden"  style={{backgroundColor: "white"}} >

                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "My lists" } open={open}/>
                    </div>
                </div>
                <div id="myListsContainer-mobile" className="mx-0 p-0 h-full flex-column flex-grow-1 md:flex"
                     style={{backgroundColor: "white"}}>
                    <div
                        className={"black-overlay absolute h-full w-full z-20 " + (open ? null : "hidden")}
                    />
                    <PageHeader
                        user={ props.user }
                        unsetUser={ props.unsetUser }
                        title="My Lists"
                        showDate={false}
                        isResponsive={true}
                        displayError={displayError}
                    />
                    <MyListsHeader
                        lists={lists}
                        setLists={setLists}
                    />

                    <Divider className={!lists || lists.length === 0? "hidden" : "m-0 p-0"} />

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

