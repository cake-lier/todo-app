import Moment from "moment";

export function filterByDateRange(rangeType, date) {
    const today = Moment(new Date());
    switch (rangeType) {
        case 0:
            return Moment(date).isBetween(Moment(new Date()).subtract(1, 'years'), today, 'day', '[]');
        case 1:
            return Moment(date).isBetween(Moment(new Date()).subtract(1, "months"), today, 'day', '[]');
        case 2:
            return Moment(date).isBetween(Moment(new Date()).subtract(7, 'days'), today, 'day', '[]');
        default:
            return true;
    }
}

const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export function getLabelsByDateRange(rangeType) {
    switch (rangeType) {
        case 0:
            return monthNames.slice(new Date().getMonth())
                             .map(m => `${ m } ${ new Date().getFullYear() - 1 }`)
                             .concat(monthNames.slice(0, new Date().getMonth() + 1)
                                               .map(m => `${ m } ${ new Date().getFullYear() }`));
        case 1:
            const monthLabels = [];
            const monthEnd = new Date();
            let monthCurrent = new Date(new Date().setMonth(new Date().getMonth() - 1));
            while (monthCurrent.valueOf() <= monthEnd.valueOf()) {
                monthLabels.push(monthCurrent.toLocaleDateString("en-GB"));
                monthCurrent = new Date(monthCurrent.setDate(monthCurrent.getDate() + 1));
            }
            return monthLabels;
        case 2:
            const weekLabels = [];
            const weekEnd = new Date();
            let weekCurrent = new Date(new Date().setDate(new Date().getDate() - 7));
            while (weekCurrent.valueOf() <= weekEnd.valueOf()) {
                weekLabels.push(weekCurrent.toLocaleDateString("en-GB"));
                weekCurrent = new Date(weekCurrent.setDate(weekCurrent.getDate() + 1));
            }
            return weekLabels;
        default:
            return [];
    }
}

export function groupByDateRange(rangeType, date) {
    const currentDate = new Date(date);
    switch (rangeType) {
        case 0:
            return `${ monthNames[currentDate.getMonth()] } ${ currentDate.getFullYear() }`;
        case 1:
        case 2:
            return currentDate.toLocaleDateString("en-GB");
        default:
            return null;
    }
}
