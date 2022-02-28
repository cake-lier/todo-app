import { useCallback, useEffect, useRef, useState } from "react";
import SideMenu from "../../../components/userPages/sideMenu/SideMenu";
import ErrorMessages from "../../../components/userPages/errorMessages/ErrorMessages";
import PageHeader from "../../../components/userPages/pageHeader/PageHeader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import axios from "axios";
import "./Calendar.scss";

export default function Calendar({ user, unsetUser, socket, notifications, setNotifications }) {
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [events, setEvents] = useState([]);
    const updateEvents = useCallback(() => {
        axios.get("/items")
             .then(
                 items => setEvents(items.data.filter(item => item.dueDate !== null || item.reminderDate !== null).map(item => {
                     if (item.dueDate !== null) {
                         return {
                             id: item._id,
                             allDay: true,
                             backgroundColor: item.completionDate === null ? "#E61950" : "#555661",
                             borderColor: item.completionDate === null ? "#E61950" : "#555661",
                             start: item.dueDate,
                             title: item.completionDate === null ? item.title : "\u{2611}️ " + item.title,
                             url: "/lists/" + item.listId
                         };
                     }
                     return {
                         id: item._id,
                         title: item.completionDate === null ? item.title : "\u{2611} " + item.title,
                         backgroundColor: item.completionDate === null ? "#E61950" : "#555661",
                         borderColor: item.completionDate === null ? "#E61950" : "#555661",
                         start: item.reminderDate,
                         url: "/lists/" + item.listId
                     };
                 })),
                 error => displayError(error.response.data.error)
             )
    }, [displayError]);
    useEffect(updateEvents, [updateEvents]);
    useEffect(() => {
        function handleUpdates(event) {
            if (new RegExp(
                    "/^(?:list(?:Deleted|Self(?:Added|Removed))|"
                    + "itemElement(?:Created|(?:Title|DueDate|Reminder|Completion)Changed|Deleted))Reload$/"
                ).test(event)) {
                updateEvents();
            }
        }
        socket.onAny(handleUpdates);
        return () => socket.offAny(handleUpdates);
    }, [socket, updateEvents]);
    const mobileCalendar = useRef();
    const desktopCalendar = useRef();
    const handleDateClick = info => {
        mobileCalendar.current.getApi().changeView("dayGridDay", info.dateStr);
        desktopCalendar.current.getApi().changeView("dayGridDay", info.dateStr);
    };
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="calendarMainMenuContainer" className="h-screen mx-0 p-0 hidden md:block">
                <SideMenu selected={ "Calendar" } open={ true } />
            </div>
            <div id="calendarPageContainer" className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="Calendar"
                    isResponsive={ false }
                    notifications={ notifications }
                    setNotifications={ setNotifications }
                    socket={ socket }
                    displayError={ displayError }
                />
                <div className="grid overflow-y-auto flex flex-1">
                    <div className="col-1 md:mx-5 lg:mx-8 mt-3 flex flex-1">
                        <FullCalendar
                            plugins={ [ dayGridPlugin, interactionPlugin, momentPlugin ] }
                            buttonText={ {
                                today: "Today",
                                month: "Month",
                                week: "Week",
                                day: "Day"
                            } }
                            headerToolbar={ {
                                start:"today prev,next",
                                center: "title",
                                end: "dayGridMonth,dayGridWeek,dayGridDay"
                            } }
                            views={ {
                                dayGridMonth: {
                                    eventTimeFormat: {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        meridiem: false
                                    }
                                },
                                dayGridWeek: {
                                    titleFormat: "DD MMM YYYY",
                                    dayHeaderFormat: "ddd DD/MM",
                                    eventTimeFormat: {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        meridiem: false
                                    }
                                },
                                dayGridDay: {
                                    titleFormat: "DD MMMM YYYY",
                                    eventTimeFormat: {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        meridiem: false
                                    }
                                }
                            } }
                            firstDay={ 1 }
                            navLinks={ true }
                            events={ events }
                            dateClick={ handleDateClick }
                            ref={ desktopCalendar }
                            initialView="dayGridMonth"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full p-0 md:hidden">
                <div id="calendarPageContainer" className="mx-0 p-0 w-full md:block">
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title="Calendar"
                        isResponsive={ true }
                        notifications={ notifications }
                        setNotifications={ setNotifications }
                        socket={ socket }
                        displayError={ displayError }
                    />
                    <div className="grid">
                        <div className="col-12 h-screen flex align-items-stretch">
                            <FullCalendar
                                plugins={ [ dayGridPlugin, interactionPlugin, momentPlugin ] }
                                buttonText={ {
                                    today: "Today",
                                    month: "Month",
                                    week: "Week",
                                    day: "Day"
                                } }
                                headerToolbar={ { start: "title", end: "prev,next" } }
                                footerToolbar={ { start: "today", end: "dayGridMonth,dayGridWeek,dayGridDay" } }
                                views={ {
                                    dayGridMonth: {
                                        eventTimeFormat: {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            meridiem: false
                                        }
                                    },
                                    dayGridWeek: {
                                        titleFormat: "DD MMM YYYY",
                                        dayHeaderFormat: "ddd d/M",
                                        eventTimeFormat: {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            meridiem: false
                                        }
                                    },
                                    dayGridDay: {
                                        titleFormat: "DD MMMM YYYY",
                                        eventTimeFormat: {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            meridiem: false
                                        }
                                    }
                                } }
                                dateClick={ handleDateClick }
                                firstDay={ 1 }
                                events={ events }
                                ref={ mobileCalendar }
                                initialView="dayGridMonth" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

