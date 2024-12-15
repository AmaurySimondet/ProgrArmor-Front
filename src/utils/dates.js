/*
* Sort date croissant
* @param {object} a
* @param {object} b
* @return {number}
*/
function sortDateCroissant(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

/*
* Datetime in string to date
* @param {string} datetime
* @return {Date}
*/
function stringToDate(datetime) {
    return new Date(datetime).toISOString().split('T')[0];
}

/*
* Date to string
* @param {Date} date
* @return {string}
*/
function dateToString(date) {
    return date.toISOString().split('T')[0];
}

/**
 * Get detailed date in french from string date
 * @param {string} date
 * @return {string}
 */
function getDetailedDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

/*
* Get date based on timeframe
* @param {string} timeframe ('3m', '1y', 'max')
* @return {Date}
*/
function dateBasedOnTimeframe(timeframe) {
    let dateMin;
    switch (timeframe) {
        case '3m':
            dateMin = new Date(new Date().setMonth(new Date().getMonth() - 3));
            break;
        case '1y':
            dateMin = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            break;
        case 'max':
            dateMin = new Date(0); // Beginning of time
            break;
        default:
            dateMin = new Date(new Date().setMonth(new Date().getMonth() - 3));
    }
    return dateMin;
}


export { sortDateCroissant, stringToDate, dateToString, getDetailedDate, dateBasedOnTimeframe };
