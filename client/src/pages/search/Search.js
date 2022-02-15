import { useCallback, useRef, useState } from "react";
import axios from "axios";
import ErrorMessages from "../../components/ErrorMessages";
import MainMenu from "../../components/mainMenu/MainMenu";
import PageHeader from "../../components/pageHeader/PageHeader";
import { Chips } from 'primereact/chips';
import "./Search.scss";
import {ProgressSpinner} from "primereact/progressspinner";
import ItemsReadonlyContainer from "../../components/item/itemsReadonlyContainer/ItemsReadonlyContainer";

export default function Search({ user, unsetUser, socket, notifications, setNotifications }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [chips, setChips] = useState([]);
    const [lists, setLists] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchItems = useCallback(chips => {
        setChips(chips);
        setLoading(true);
        axios.get("/items")
             .then(
                 items => {
                     setItems(items.data.filter(i => i.tags.some(t => chips.includes(t.title))));
                     axios.get("/lists")
                          .then(
                             lists => {
                                 setLists(lists.data);
                                 setLoading(false);
                             },
                             error => displayError(error.response.data.error)
                         );
                 },
                 error => displayError(error.response.data.error)
             );
    }, [setItems, displayError]);
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="searchMainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Search" } open={ true } />
            </div>
            <div id="searchPageContainer" className="mx-0 p-0 flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Search" }
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-grow-1 overflow-y-auto">
                    <div className="col-12 h-full">
                        <div className="grid px-3 pt-3 h-full flex-column">
                            <div className="col-12">
                                <Chips
                                    placeholder="Search items for tags"
                                    className="w-full"
                                    value={ chips }
                                    onChange={ e => searchItems(e.value) }
                                />
                            </div>
                            <div
                                className={ "col-12 "
                                            + (loading || items.length === 0
                                               ? "flex flex-grow-1 align-items-center"
                                               : "") }
                            >
                                {
                                    loading
                                    ? <ProgressSpinner
                                          style={{ width: '50px', height: '50px' }}
                                          strokeWidth="2"
                                          fill="var(--surface-ground)"
                                          animationDuration=".5s"
                                      />
                                    : <ItemsReadonlyContainer
                                          emptyTitle="No items to display"
                                          emptySubtitle="No items with at least one of the given tags were found"
                                          currentItems={ items }
                                          lists={ lists }
                                          displayError={ displayError }
                                      />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="searchPageContainer" className="mx-0 p-0 flex flex-column w-full flex-1 md:hidden">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title={ "Search" }
                    isResponsive={ true }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid flex-grow-1 overflow-y-auto">
                    <div className="col-12 h-full">
                        <div className="grid flex-column h-full">
                            <div className="col-12">
                                <Chips
                                    placeholder="Search items for tags"
                                    className="w-full"
                                    value={ chips }
                                    onChange={ e => searchItems(e.value) }
                                />
                            </div>
                            <div className={ "col-12 "
                                             + (loading || items.length === 0
                                                ? "flex flex-grow-1 align-items-center"
                                                : "") }
                            >
                                {
                                    loading
                                        ? <ProgressSpinner
                                            style={{ width: '50px', height: '50px' }}
                                            strokeWidth="2"
                                            fill="var(--surface-ground)"
                                            animationDuration=".5s"
                                        />
                                        : <ItemsReadonlyContainer
                                            emptyTitle="No items to display"
                                            emptySubtitle="No items with at least one of the given tags were found"
                                            currentItems={ items }
                                            lists={ lists }
                                            displayError={ displayError }
                                        />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
