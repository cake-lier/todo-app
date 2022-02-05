export function filterByDateRange(rangeType, date) {
    switch (rangeType) {
        case 0:
            return new Date(date).valueOf() - new Date().setFullYear(new Date().getFullYear() - 1) > 0;
        case 1:
            return new Date(date).valueOf() - new Date().setMonth(new Date().getMonth() - 1) > 0;
        case 2:
            return new Date(date).valueOf() - new Date().setDate(new Date().getDate() - 7) > 0;
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
            return monthNames.slice(new Date().getMonth() + 1).concat(monthNames.slice(0, new Date().getMonth() + 1));
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
    switch (rangeType) {
        case 0:
            return monthNames[new Date(date).getMonth()];
        case 1:
        case 2:
            return new Date(date).toLocaleDateString("en-GB");
        default:
            return null;
    }
}
