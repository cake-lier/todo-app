import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Divider} from "primereact/divider";
import {useOnClickOutside} from "../../components/ClickOutsideHook";
import ErrorMessages from "../../components/ErrorMessages";
import {MainMenu} from "../../components/mainMenu/MainMenu";
import BurgerMenu from "../../components/BurgerMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import axios from "axios";
import "./Reports.scss";
import ItemsChart from "../../components/ItemsChart";
import CompletionChart from "../../components/CompletionChart";
import {SelectButton} from "primereact/selectbutton";
import EmptyPlaceholder from "../../components/EmptyPlaceholder";

export default function Reports({ user, unsetUser, tab, socket, notifications, setNotifications }) {

    // achievement
    useEffect( ()=> {
        if (!user.achievements[10]){ // if not yet unlocked
            axios.put("/users/me/achievements", {index: 10}).then(r => {});
            user.achievements[10] = true;
        }
    }, []);
    // ---

    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [filter, setFilter] = useState(0);
    const [lists, setLists] = useState([]);
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const useOnTabClicked = url => {
        return useCallback(
            () => {
                setFilter(0);
                navigate("/reports/" + url);
            }, [url]
        );
    }
    const [open, setOpen] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    };
    const getTabElement = tabName => {
        if (tabName === "items-completed") {
            return <ItemsChart lists={ lists } items={ items } filter={ filter } />;
        }
        return <CompletionChart lists={ lists } items={ items } filter={ filter } />;
    };
    const updateItems = useCallback(() => {
        axios.get("/lists")
            .then(lists => setLists(lists.data))
            .then(_ => axios.get("/items"))
            .then(
                 items => setItems(items.data),
                 error => displayError(error.response.data.error)
             );
    }, [setLists, setItems, displayError]);
    useEffect(updateItems, [updateItems]);
    useEffect(() => {
        function handleUpdates(event) {
            if (new RegExp(
                    "^(?:list(?:Deleted|TitleChanged|Self(?:Added|Removed))"
                    + "|item(?:Created|(?:Completion|Count)Changed|Deleted))Reload$"
                ).test(event)) {
                updateItems();
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [socket, updateItems]);
    const filterSelectItems = [
        { label: "Year", value: 0 },
        { label: "Month", value: 1 },
        { label: "Week", value: 2 }
    ].concat(tab === "items-completed" ? [] : [ { label: "All time", value: 3 } ]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="reportsMainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Reports" } open={ true } />
            </div>
            <div id="reportsMainMenuContainer" className="mx-0 p-0 h-full absolute flex justify-content-center md:hidden">
                <div className="h-full w-full" ref={ node } style={ divStyle }>
                    <BurgerMenu open={ open } setOpen={ setOpen } />
                    <MainMenu selected={ "Reports" } open={ open } />
                </div>
            </div>
            <div id="reportsPageContainer" className="mx-0 p-0 flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Reports" }
                    isResponsive={ false }
                    tabs={ [
                        { label: "Completion rate", command: useOnTabClicked("completion-rate") },
                        { label: "Items completed", command: useOnTabClicked("items-completed") }
                    ] }
                    activeTabIndex={ tab === "completion-rate" ? 0 : 1 }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-column flex-grow-1">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    {
                        items.filter(i => i.completionDate !== null).length === 0
                            ? <div className="col-12 flex flex-grow-1 flex-column justify-content-center align-content-center">
                                  <EmptyPlaceholder
                                      title={ "No reports to display" }
                                      subtitle={ "Complete your first item and then come back here" }
                                  />
                              </div>
                            :
                              <>
                                  <div id="filters" className="col-12 flex justify-content-center">
                                      <SelectButton
                                          value={ filter }
                                          options={ filterSelectItems }
                                          onChange={ e => setFilter(e.value) }
                                          unselectable={ false }
                                      />
                                  </div>
                                  <div className="col-12 flex flex-grow-1 justify-content-center align-items-center">
                                      { getTabElement(tab) }
                                  </div>
                              </>
                    }
                </div>
            </div>
            <div id="reportsPageContainer" className="mx-0 p-0 flex flex-column w-full flex-1 md:hidden">
                <div className={"black-overlay absolute h-full w-full z-5 " + (open ? null : "hidden")} />
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Reports" }
                    isResponsive={ true }
                    tabs={ [
                        { label: "Completion rate", command: useOnTabClicked("completion-rate") },
                        { label: "Items completed", command: useOnTabClicked("items-completed") }
                    ] }
                    activeTabIndex={ tab === "completion-rate" ? 0 : 1 }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-column flex-grow-1">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    {
                        items.filter(i => i.completionDate !== null).length === 0
                        ? <EmptyPlaceholder
                              title={ "No reports to display" }
                              subtitle={ "Complete your first item and then come back here" }
                          />
                        : <>
                              <div id="filters" className="col-12 flex justify-content-center">
                                  <SelectButton
                                      value={ filter }
                                      options={ filterSelectItems }
                                      onChange={ e => setFilter(e.value) }
                                      unselectable={ false }
                                  />
                              </div>
                              <div className="col-12 flex flex-grow-1 justify-content-center align-items-center">
                                  { getTabElement(tab) }
                              </div>
                          </>
                    }
                </div>
            </div>
        </div>
    );
}
