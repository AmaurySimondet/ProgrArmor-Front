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

export { sortDateCroissant, stringToDate };