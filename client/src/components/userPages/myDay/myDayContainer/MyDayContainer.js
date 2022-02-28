import axios from "axios";
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import "./MyDayItem.scss"
import EmptyPlaceholder from "../../emptyPlaceholder/EmptyPlaceholder";
import Moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { ProgressSpinner } from 'primereact/progressspinner';
import ItemsReadonlyContainer from "../../itemsReadonlyContainer/ItemsReadonlyContainer";
import _ from "lodash";

export default function MyDayContainer({ socket, displayError }) {
    const [pastDue, setPastDue] = useState([]);
    const [dueToday, setDueToday] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [prioritized, setPrioritized] = useState([]);
    const [lists, setLists] = useState([]);
    const [tasksPresent, setTasksPresent] = useState(false);
    const [loading, setLoading] = useState(true);
    const getItems = useCallback(() => {
        axios.get("/items")
             .then(
                 items => {
                     const today = Moment(Date.now());
                     const dueItems = items.data.filter(i => !i.priority && i.dueDate && !i.completionDate);
                     const prioritizedItems = items.data.filter(i => i.priority && !i.completionDate);
                     if (dueItems.length + prioritizedItems.length > 0) {
                         const currentPastDue = dueItems.filter(i => Moment(i.dueDate).isBefore(today, 'day')).slice(0, 5);
                         setPastDue(currentPastDue);
                         const currentDueToday = dueItems.filter(i => Moment(i.dueDate).isSame(today, 'day')).slice(0, 5);
                         setDueToday(currentDueToday);
                         const currentUpcoming = dueItems.filter(i => Moment(i.dueDate).isAfter(today, 'day')).slice(0, 5);
                         setUpcoming(currentUpcoming);
                         const currentPrioritized = prioritizedItems.slice(0, 5);
                         setPrioritized(currentPrioritized);
                         const listIds = _.uniq(
                             [...currentPastDue, ...currentDueToday, ...currentUpcoming, ...currentPrioritized].map(i => i.listId)
                         );
                         return axios.get("/lists")
                                     .then(
                                         lists => {
                                             setLists(lists.data.filter(l => listIds.includes(l._id)));
                                             setTasksPresent(true);
                                         },
                                         error => displayError(error.response.data.error)
                                     );
                     }
                     setTasksPresent(false);
                     return Promise.resolve();
                 },
                 error => displayError(error.response.data.error)
             )
             .then(_ => setLoading(false));
    }, [displayError, setPastDue, setDueToday, setUpcoming, setPrioritized, setTasksPresent, setLoading]);
    useEffect(getItems, [getItems]);
    useEffect(() => {
        function handleUpdates(event) {
            if (new RegExp(
                    "^(?:list(?:Deleted|Self(?:Added|Removed))|"
                    + "itemElement(?:Created|(?:Title|Text|Date|Completion|Count)Changed|Assignee(?:Added|Changed|Removed)|"
                    + "Tags(?:Added|Removed)|Deleted))Reload$"
                ).test(event)) {
                getItems();
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [socket, getItems]);
    const template = options => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const className = `${options.className} justify-content-start px-0`;
        const titleClassName = `${options.titleClassName} pl-1`;
        const title = options.props.id.toString().includes("past-due")
                      ? "Past due"
                      : (options.props.id.toString().includes("due-today")
                         ? "Due today"
                         : (options.props.id.toString().includes("prioritized") ? "Important" : "Upcoming"));
        return (
            <div className={ className }>
                <button className={ options.togglerClassName } onClick={ options.onTogglerClick }>
                    <span className={ toggleIcon } />
                    <Ripple />
                </button>
                <span className={ titleClassName }>
                    { title }
                </span>
            </div>
        );
    };

    return (
        <div id="my-day-items"
             className={ "card flex flex-grow-1 flex-column "
                         + (tasksPresent ? "overflow-y-auto" : "justify-content-center align-items-center") }
        >
            <ProgressSpinner
                className={loading? null : "hidden"}
                style={{width: '50px', height: '50px'}}
                strokeWidth="2"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            {
                loading || prioritized.length === 0
                ? null
                : <Panel
                      id="prioritized"
                      headerTemplate={ template }
                      titleElement="P"
                      toggleable
                  >
                      <ItemsReadonlyContainer
                          currentItems={ prioritized }
                          lists={ lists }
                          displayError={ displayError }
                      />
                  </Panel>
            }
            {
                loading || pastDue.length === 0
                ? null
                : <Panel
                      id="past-due"
                      headerTemplate={ template }
                      titleElement="P"
                      toggleable
                  >
                      <ItemsReadonlyContainer
                          currentItems={ pastDue }
                          lists={ lists }
                          displayError={ displayError }
                      />
                  </Panel>
            }
            {
                loading || dueToday.length === 0
                ? null
                : <Panel
                      id="due-today"
                      headerTemplate={ template }
                      toggleable
                  >
                      <ItemsReadonlyContainer
                          currentItems={ dueToday }
                          lists={ lists }
                          displayError={ displayError }
                      />
                  </Panel>
            }
            {
                loading || upcoming.length === 0
                ? null
                : <Panel
                      id="upcoming"
                      headerTemplate={template}
                      toggleable
                  >
                      <ItemsReadonlyContainer
                          currentItems={ upcoming }
                          lists={ lists }
                          displayError={ displayError }
                      />
                  </Panel>
            }
            <div className={ ( !loading && !tasksPresent ? "" : "hidden") }>
                <EmptyPlaceholder
                    title={ "No items to display" }
                    subtitle={ "Items that have a due date or a priority will show up here." }
                    type={"items"}
                />
            </div>
        </div>
    );
}
