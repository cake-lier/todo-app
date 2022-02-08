import { useCallback, useEffect, useRef, useState } from "react";
import BurgerMenu from "../../components/BurgerMenu";
import { useOnClickOutside } from "../../components/ClickOutsideHook";
import { MainMenu } from "../../components/mainMenu/MainMenu";
import ErrorMessages from "../../components/ErrorMessages";
import PageHeader from "../../components/pageHeader/PageHeader";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import rrulePlugin from "@fullcalendar/rrule";
import { Divider } from "primereact/divider";
import axios from "axios";
import "./Calendar.scss";

export default function Calendar(props) {
    const { user, unsetUser, socket } = props;
    const errors = useRef();
    const displayError = useCallback(lastErrorCode => {
        errors.current.displayError(lastErrorCode);
    }, [errors]);
    const [open, setOpen] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false));
    const divStyle = {
        zIndex: "10",
        position: "relative",
        visible: "false"
    }
    const [events, setEvents] = useState([]);
    const updateEvents = useCallback(() => {
        axios.get("/items")
             .then(
                 items => setEvents(items.data.filter(item => item.dueDate !== null || item.reminderString !== null).map(item => {
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
                         allDay: !item.reminderString.includes("FREQ=HOURLY"),
                         backgroundColor: item.completionDate === null ? "#E61950" : "#555661",
                         borderColor: item.completionDate === null ? "#E61950" : "#555661",
                         rrule: item.reminderString,
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
                    + "item(?:Created|(?:Title|Date|Completion)Changed|Deleted))Reload$/"
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
                <MainMenu selected={ "Calendar" } open={ true } />
            </div>
            <div id="calendarPageContainer" className="mx-0 p-0 h-full flex-column flex-1 hidden md:flex">
                <PageHeader
                    user={ user }
                    unsetUser={ unsetUser }
                    title="Calendar"
                    isResponsive={ false }
                    notifications={ props.notifications }
                    setNotifications={ props.setNotifications }
                    socket={ props.socket }
                    displayError={ displayError }
                />
                <div className="grid overflow-y-auto">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-1 mx-8 mt-3 flex flex-1">
                        <FullCalendar
                            plugins={ [ dayGridPlugin, interactionPlugin, momentPlugin, rrulePlugin ] }
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
                <div className="col-1 p-0 h-full absolute justify-content-center">
                    <div className="h-full w-full" ref={ node } style={ divStyle }>
                        <BurgerMenu open={ open } setOpen={ setOpen } />
                        <MainMenu selected={ "My day" } open={open} />
                    </div>
                </div>
                <div id="calendarPageContainer" className="mx-0 p-0 w-full md:block">
                    <div
                        className={"black-overlay absolute h-full w-full z-5 " + (open ? null : "hidden")}
                    />
                    <PageHeader
                        user={ user }
                        unsetUser={ unsetUser }
                        title="Calendar"
                        isResponsive={ true }
                        notifications={ props.notifications }
                        setNotifications={ props.setNotifications }
                        socket={ props.socket }
                        displayError={ displayError }
                    />
                    <div className="grid">
                        <div className="col-12 p-0">
                            <Divider className="my-0" />
                        </div>
                        <div className="col-12 h-screen flex align-items-stretch">
                            <FullCalendar
                                plugins={ [ dayGridPlugin, interactionPlugin, momentPlugin, rrulePlugin ] }
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

