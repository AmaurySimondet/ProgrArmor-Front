function sortDateCroissant(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
}

export { sortDateCroissant }