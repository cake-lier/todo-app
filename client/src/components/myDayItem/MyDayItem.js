import axios from "axios";
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import "./MyDayItem.scss"
import EmptyPlaceholder from "../EmptyPlaceholder";
import Moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {ItemsContainer} from "../item/itemsContainer/ItemsContainer";

export default function MyDayItem({ socket, displayError }) {
    const [pastDue, setPastDue] = useState([]);
    const [dueToday, setDueToday] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [tasksPresent, setTasksPresent] = useState(false);
    const getItems = useCallback(() => {
        axios.get("/items")
            .then(
                items => {
                    const today = Moment(Date.now());
                    const dueTasks = items.data.filter(i => i.dueDate !== null && i.completionDate === null);
                    if (dueTasks.length > 0) {
                        const pastDue = dueTasks.filter(i => Moment(i.dueDate).isBefore(today, 'day'));
                        const dueToday = dueTasks.filter(i => Moment(i.dueDate).isSame(today, 'day'));
                        const upcoming = dueTasks.filter(i => Moment(i.dueDate).isAfter(today, 'day'));
                        setPastDue(pastDue);
                        setDueToday(dueToday);
                        setUpcoming(upcoming);
                        setTasksPresent(true);
                    } else {
                        setTasksPresent(false);
                    }
                },
                error => displayError(error.response.data.error)
            );
    }, [displayError, setPastDue, setDueToday, setUpcoming, setTasksPresent]);
    useEffect(getItems, [getItems]);
    useEffect(() => {
        function handleUpdates(event) {
            if (new RegExp(
                    "^(?:list(?:Deleted|Self(?:Added|Removed))|"
                    + "item(?:Created|(?:Title|Text|Date|Completion|Count)Changed|Assignee(?:Added|Removed)|"
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
                      : (options.props.id.toString().includes("due-today") ? "Due today" : "Upcoming");
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
        )
    }
    return (
        <div id="my-day-items"
             className={ "card flex flex-grow-1 flex-column "
                         + (tasksPresent ? "" : "justify-content-center align-items-center") }
        >
            <Panel
                id="past-due"
                className={ pastDue.length > 0 ? "" : "hidden" }
                headerTemplate={ template }
                titleElement="P"
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ pastDue } />
            </Panel>
            <Panel
                id="due-today"
                className={ dueToday.length > 0 ? "" : "hidden" }
                headerTemplate={ template }
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ dueToday } />
            </Panel>
            <Panel
                id="upcoming"
                className={ upcoming.length > 0 ? "" : "hidden" }
                headerTemplate={template}
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ upcoming } />
            </Panel>
            <div className={ (tasksPresent ? "hidden" : null) }>
                <EmptyPlaceholder
                    title={ "No items to display" }
                    subtitle={ "Items that have a due date will show up here" }
                />
            </div>
        </div>
    );
}
