import { createRef, useCallback, useEffect, useRef, useState } from "react";
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
    useEffect(() => {
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
                            title: item.title,
                            url: "/lists/" + item.listId
                        };
                    }
                    return {
                        id: item._id,
                        title: item.title,
                        allDay: !item.reminderString.includes("FREQ=HOURLY"),
                        backgroundColor: item.completionDate === null ? "#E61950" : "#555661",
                        borderColor: item.completionDate === null ? "#E61950" : "#555661",
                        rrule: item.reminderString,
                        url: "/lists/" + item.listId
                    };
                })),
                error => displayError(error.response.data.error))
    }, [displayError]);
    const mobileCalendar = createRef();
    const desktopCalendar = createRef();
    const handleDateClick = info => {
        mobileCalendar.current.getApi().changeView("dayGridDay", info.dateStr);
        desktopCalendar.current.getApi().changeView("dayGridDay", info.dateStr);
    };
    return (
        <div className="grid h-screen">
            <ErrorMessages ref={ errors } />
            <div id="calendarMainMenuContainer" className="mx-0 p-0 hidden md:block">
                <MainMenu selected={ "Calendar" } open={ true } />
            </div>
            <div id="calendarPageContainer" className="h-screen mx-0 p-0 hidden md:block m-0">
                <PageHeader
                    user={ props.user }
                    unsetUser={ props.unsetUser }
                    title="Calendar"
                    isResponsive={ false }
                    displayError={ displayError }
                />
                <div className="grid">
                    <div className="col-12 p-0">
                        <Divider className="my-0" />
                    </div>
                    <div className="col-6 ml-8 mt-3">
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
                    <PageHeader
                        user={ props.user }
                        unsetUser={ props.unsetUser }
                        title="Calendar"
                        isResponsive={ true }
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

