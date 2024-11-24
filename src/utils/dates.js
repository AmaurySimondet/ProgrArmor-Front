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


export { sortDateCroissant, stringToDate, dateToString, getDetailedDate };