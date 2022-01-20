import {useRef, useState} from "react";
import BurgerMenu from "../../components/BurgerMenu";
import { useOnClickOutside } from "../../components/ClickOutsideHook";
import Moment from "react-moment";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import { UserIcon } from "../../components/userIcon/UserIcon";
import ErrorMessages from "../../components/ErrorMessages";
import "./MyDay.scss";

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
                <div className="grid">
                    <div className="col-4 flex-columns justify-content-center">
                        <h3 className="text-3xl font-semibold">My day</h3>
                        <p className="text-md mt-2"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                    </div>
                    <div className="col-7"/>
                    <div className="col-1 flex justify-content-center">
                        <UserIcon
                            user={ props.user }
                            unsetUser={ props.unsetUser }
                            displayError={ displayError }
                        />
                    </div>
                </div>
            </div>

            <div className="w-full p-0 md:hidden">
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={node} style={divStyle}>
                        <BurgerMenu open={open} setOpen={setOpen} />
                        <MainMenu selected={ "My day" } open={open}/>
                    </div>
                </div>
                <div id="pageContainer" className="mx-0 p-0 w-full md:block">
                    <div className="grid">
                        <div className="col-2 "/>
                        <div className="col-8 flex-columns justify-content-center">
                            <h3 className="text-3xl font-semibold">My day</h3>
                            <p className="text-md mt-2"><Moment date={ Date.now() } local format="dddd, MMMM Do" /></p>
                        </div>
                        <div className="col-1 flex justify-content-center">
                            <UserIcon
                                user={ props.user }
                                unsetUser={ props.unsetUser }
                                displayError={ displayError }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );

}

export default MyDay;

