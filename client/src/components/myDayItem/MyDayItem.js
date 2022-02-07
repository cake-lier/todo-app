import axios from "axios";
import { Panel } from 'primereact/panel';
import { Ripple } from 'primereact/ripple';
import "./MyDayItem.scss"
import EmptyTaskSVG from "../EmptyTaskSVG";
import Moment from "moment";
import {useEffect, useState} from "react";
import {ItemsContainer} from "../item/itemsContainer/ItemsContainer";

export default function MyDayItem({displayError}) {
    const [pastDue, setPastDue] = useState([]);
    const [dueToday, setDueToday] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [tasksPresent, setTasksPresent] = useState(false);

    useEffect(() => {
        axios.get("/items")
             .then(
                 res => {
                     if (res.data.length) {
                         const today = Moment(Date.now())
                         const dueTask = res.data.filter(i => i.dueDate !== null)
                         const pastDue = dueTask.filter(i => Moment(i.dueDate).isBefore(today, 'day'))
                         const dueToday = dueTask.filter(i => Moment(i.dueDate).isSame(today, 'day'))
                         const upcoming = dueTask.filter(i => Moment(i.dueDate).isAfter(today, 'day'))
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

    const template = (options) => {
        const toggleIcon = options.collapsed ? 'pi pi-chevron-down' : 'pi pi-chevron-up';
        const className = `${options.className} justify-content-start px-0`;
        const titleClassName = `${options.titleClassName} pl-1`;
        const title = options.props.id.toString().includes("past-due")
            ? "Past due" : options.props.id.toString().includes("due-today")
            ? "Due today" : "Upcoming"

        return (
            <div className={className}>
                <button className={options.togglerClassName} onClick={options.onTogglerClick}>
                    <span className={toggleIcon}></span>
                    <Ripple />
                </button>
                <span className={titleClassName}>
                    {title}
                </span>
            </div>
        )
    }

    return (
        <div id="my-day-items"
             className={"card flex flex-grow-1 flex-column " + (tasksPresent ? null : "justify-content-center align-items-center")}>
            <Panel
                id="past-due"
                className={pastDue.length > 0 ? null : "hidden"}
                headerTemplate={template}
                titleElement="P"
                collapsed
                toggleable>
                <ItemsContainer listId={null} myDayItems={pastDue} />
            </Panel>
            <Panel
                id="due-today"
                className={dueToday.length > 0 ? null : "hidden"}
                headerTemplate={template}
                collapsed
                toggleable>
                <ItemsContainer listId={null} myDayItems={dueToday} />
            </Panel>
            <Panel
                id="upcoming"
                className={upcoming.length > 0 ? null : "hidden"}
                headerTemplate={template}
                collapsed
                toggleable>
                <ItemsContainer listId={null} myDayItems={upcoming} />
            </Panel>
            <div className={(tasksPresent ? "hidden" : null)}>
                <EmptyTaskSVG/>
            </div>
        </div>
    );
}
