import React, {useCallback, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { DataView } from 'primereact/dataview';
import axios from "axios";
import "./ListItem.scss";
import EmptyPlaceholder from "../EmptyPlaceholder";
import { ProgressSpinner } from 'primereact/progressspinner';
import ListOptionsMenu from "../ListOptionsMenu";

export default function ListItem({ setUser, lists, setLists, userId, ownership = true, displayError, socket, disabledNotificationsLists, ordering }) {
    const [loading, setLoading] = useState(true);
    const getSortField = ordering => {
        switch (ordering) {
            case 0:
            case 1:
                return "title";
            case 2:
            case 3:
                return "creationDate";
            default:
                return null;
        }
    };
    const getSortOrder = ordering => {
        switch (ordering) {
            case 0:
            case 2:
                return 1;
            case 1:
            case 3:
                return -1;
            default:
                return null;
        }
    };

    useEffect(() => {
        axios.get(ownership ? "/lists?shared=false" : "/lists?shared=true")
             .then(
                 lists => setLists(lists.data),
                 error => displayError(error.response.data.error)
             )
            .then(_ => setLoading(false));
    }, [ownership, setLists, displayError, setLoading]);

    useEffect(() => {
        function handleUpdates(event) {
            if ((/^list(?:Created|Deleted|(?:Title|Visibility|Color)Changed|Member(?:Added|Removed))Reload$/.test(event))
                || (/^listSelf(?:Added|Removed)Reload$/.test(event) && !ownership)) {
                axios.get(ownership ? "/lists?shared=false" : "/lists?shared=true")
                     .then(
                         lists => setLists(lists.data),
                         error => displayError(error.response.data.error)
                     );
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [ownership, displayError, socket, setLists]);
    const navigate = useNavigate();
    const onTitleClick = useCallback(id => navigate(`/my-lists/${ id }`), [navigate]);
    const itemTemplate = useCallback(list => {
        const listColor = [ "red-list", "purple-list", "blue-list", "green-list", "yellow-list" ];
        if (!list) {
            return;
        }
        return (
            <div className="col-12 m-0 p-0 pl-2 flex flex-row align-items-center list-item">
                <div className="col-11 flex align-items-center" id="list-icon">
                    <i className={ "pi pi-circle-fill item " + (listColor[list.colorIndex]) } />
                    <i className="pi pi-list item ml-2 pl-1" />
                    <h1 className="ml-2 cursor-pointer text-xl" onClick={ () => onTitleClick(list._id) }>{ list.title }</h1>
                </div>
                <div className="col-1 flex flex-row-reverse align-items-center">
                    <ListOptionsMenu
                        userId={ userId }
                        setUser={ setUser }
                        ownership={ ownership }
                        disabledNotificationsLists={ disabledNotificationsLists }
                        list={ list }
                        lists={ lists }
                        setLists={ setLists }
                        displayError={ displayError }
                    />
                </div>
            </div>
        );
    }, [userId, setUser, ownership, disabledNotificationsLists, lists, setLists, displayError, onTitleClick]);
    return (
        <div className={"card flex flex-grow-1 " + (!lists.length ? "justify-content-center align-items-center" : null) }>
            <ProgressSpinner
                className={loading? null : "hidden"}
                style={{width: '50px', height: '50px'}}
                strokeWidth="2"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            <DataView
                className={ !loading && lists.length ? "w-full" : "hidden"}
                value={ lists }
                layout="list"
                itemTemplate={ itemTemplate }
                rows={ 10 }
                paginator={ lists.length > 10 }
                alwaysShowPaginator={ false }
                sortField={ getSortField(ordering) }
                sortOrder={ getSortOrder(ordering) }
            />
            <div className={ ( !loading && !lists.length ? null : "hidden") }>
                <EmptyPlaceholder
                    title="No lists to display"
                    subtitle={ ownership ? "Create a list and start organizing your days!" : "Lists which you are member of will show up here."}
                    type={"lists"}
                />
            </div>
        </div>
    );
}
