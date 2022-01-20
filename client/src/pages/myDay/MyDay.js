import {useRef, useState} from "react";
import BurgerMenu from "../../components/BurgerMenu";
import { useOnClickOutside } from "../../components/ClickOutsideHook";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import ErrorMessages from "../../components/ErrorMessages";
import "./MyDay.scss";
import PageHeader from "../../components/pageHeader/PageHeader";

function MyDay(props) {

    const displayError = (lastErrorCode) => {
        props.errors.displayError(lastErrorCode);
    }

    const [open, setOpen] = useState(false);
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
                <MainMenu selected={ "My day" } open={true}/>
            </div>

            <div id="pageContainer" className="mx-0 p-0  flex-grow-1 hidden md:block m-0">
                <PageHeader
                    props={props}
                    title="My Day"
                    showDate={true}
                    isResponsive={false}
                    displayError={displayError}
                />
            </div>

            <div className="w-full p-0 md:hidden">
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "My day" } open={open}/>
                    </div>
                </div>
                <div id="pageContainer" className="mx-0 p-0 w-full md:block">
                    <PageHeader
                        props={props}
                        title="My day"
                        showDate={true}
                        isResponsive={true}
                        displayError={displayError}
                    />
                </div>
            </div>
        </div>
        );

}

export default MyDay;

