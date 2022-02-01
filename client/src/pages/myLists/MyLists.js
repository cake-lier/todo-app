import ErrorMessages from "../../components/ErrorMessages";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { useCallback, useRef, useState } from "react";
import MyListsHeader from "../../components/myListsHeader/MyListsHeader";
import ListItem from "../../components/listItem/ListItem";
import { Divider } from "primereact/divider";
import { useOnClickOutside } from "../../components/ClickOutsideHook";

export default function MyLists(props) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [open, setOpen] = useState(false);
    const [lists, setLists] = useState([]);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    };
    const appendList = useCallback(list => setLists(lists.concat(list)), [lists, setLists]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="mainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "My lists" } open={ true } />
            </div>
            <div
                id="myListsContainer"
                style={{ backgroundColor: "white" }}
                className="mx-0 p-0 h-full flex-column flex-grow-1 hidden md:flex"
            >
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title="My Lists"
                    showDate={ false }
                    isResponsive={ false }
                    displayError={ displayError }
                />
                <MyListsHeader appendList={ appendList } displayError={ displayError } />
                <Divider className="p-0" />
                <ListItem lists={ lists } setLists={ setLists } displayError={ displayError } />
            </div>
            <div className="w-full p-0 md:hidden" style={{ backgroundColor: "white" }} >
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "My lists" } open={open}/>
                    </div>
                </div>
                <div id="myListsContainer-mobile" className="mx-0 p-0 h-full flex-column flex-grow-1 md:flex"
                     style={{ backgroundColor: "white" }}>
                    <div className={ "black-overlay absolute h-full w-full z-20 " + (open ? "" : "hidden") } />
                    <PageHeader
                        user={ props.user }
                        unsetUser={ props.unsetUser }
                        title="My Lists"
                        showDate={ false }
                        isResponsive={ true }
                        displayError={ displayError }
                    />
                    <MyListsHeader appendList={ appendList } displayError={ displayError } />
                    <Divider className="p-0" />
                    <ListItem lists={ lists } setLists={ setLists } displayError={ displayError } />
                </div>
            </div>
        </div>
    );
}
