import { useEffect, useState } from "react";
import { DataView } from 'primereact/dataview';
import axios from "axios";
import EmptyPlaceholder from "../EmptyPlaceholder";
import { ProgressSpinner } from 'primereact/progressspinner';
import "./ListsItem.scss";
import ListItem from "../ListItem";

export default function ListsItem({ setUser, lists, setLists, userId, ownership = true, displayError, socket, disabledNotificationsLists, ordering }) {
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
    return (
        <div className={"card flex flex-grow-1 overflow-y-auto " + (!lists.length ? "justify-content-center align-items-center" : null) }>
            <ProgressSpinner
                className={loading? null : "hidden"}
                style={{width: '50px', height: '50px'}}
                strokeWidth="2"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            <DataView
                className={ !loading && lists.length ? "w-full " : "hidden"}
                value={ lists }
                layout="list"
                itemTemplate={ list =>
                    <ListItem
                        userId={ userId }
                        setUser={ setUser }
                        list={ list }
                        lists={ lists }
                        setLists={ setLists }
                        ownership={ ownership }
                        disabledNotificationsLists={ disabledNotificationsLists }
                        displayError={ displayError }
                    />
                }
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
