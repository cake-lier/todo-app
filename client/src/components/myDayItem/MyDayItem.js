import axios from "axios";
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import "./MyDayItem.scss"
import EmptyPlaceholder from "../EmptyPlaceholder";
import Moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {ItemsContainer} from "../item/itemsContainer/ItemsContainer";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function MyDayItem({ socket, displayError }) {
    const [pastDue, setPastDue] = useState([]);
    const [dueToday, setDueToday] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [tasksPresent, setTasksPresent] = useState(false);
    const [loading, setLoading] = useState(true);
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
                        setLoading(false);
                    } else {
                        setTasksPresent(false);
                    }
                },
                error => displayError(error.response.data.error)
            )
            .then(_ => setLoading(false));
    }, [displayError, setPastDue, setDueToday, setUpcoming, setTasksPresent, setLoading]);
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
                         + (tasksPresent ? "overflow-y-auto" : "justify-content-center align-items-center") }
        >
            <ProgressSpinner
                className={loading? null : "hidden"}
                style={{width: '50px', height: '50px'}}
                strokeWidth="2"
                fill="var(--surface-ground)"
                animationDuration=".5s"
            />
            <Panel
                id="past-due"
                className={ !loading && pastDue.length > 0 ? "" : "hidden" }
                headerTemplate={ template }
                titleElement="P"
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ pastDue } displayError={ displayError } />
            </Panel>
            <Panel
                id="due-today"
                className={ !loading && dueToday.length > 0 ? "" : "hidden" }
                headerTemplate={ template }
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ dueToday } displayError={ displayError } />
            </Panel>
            <Panel
                id="upcoming"
                className={ !loading && upcoming.length > 0 ? "" : "hidden" }
                headerTemplate={template}
                collapsed
                toggleable>
                <ItemsContainer listId={ null } myDayItems={ upcoming } displayError={ displayError } />
            </Panel>
            <div className={ ( !loading && !tasksPresent ? null : "hidden") }>
                <EmptyPlaceholder
                    title={ "No items to display" }
                    subtitle={ "Items that have a due date will show up here." }
                    type={"items"}
                />
            </div>
        </div>
    );
}
