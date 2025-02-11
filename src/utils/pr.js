import API from "./API";

/**
 * Check if a set is a personal record
 * @param {object} set set object with the following structure: {unit, value, weightLoad, elastic}
 * @param {string} exercice id of the exercice
 * @param {list} categories writen as [{category: "id"}]
 * @returns {string} "PR" if it is a personal record, "SB" if it is the same best, null if it is not a personal record
 */
export const isPersonalRecord = async (seanceId, set, exercice, categories) => {
    // Extract necessary data from the set
    const { unit, value, weightLoad, elastic } = set;

    if (value === 0) return null; // Ignore sets with 0 reps

    // Call the API to check if this set is a personal record
    try {
        const userId = localStorage.getItem("id");

        // Check if this is the first time recording this exercise
        const allSetsQuery = {
            excludedSeanceId: seanceId,
            userId,
            exercice,
            categories
        };
        const allSets = await API.getSeanceSets(allSetsQuery);
        if (allSets.data.sets.length === 0) {
            return "NB"; // New Best - first time recording this exercise
        }

        const query = {
            excludedSeanceId: seanceId,
            userId,
            exercice,
            categories,
            unit
        };
        if (value) query.value = { $gte: value };
        if (weightLoad) query.weightLoad = { $gte: weightLoad };
        if (elastic && elastic.use) {
            if (elastic.use === "resistance") { query["elastic.tension"] = { $gte: elastic.tension } };
            if (elastic.use === "assistance") { query["elastic.tension"] = { $lte: elastic.tension } };
        }

        let sets = await API.getSeanceSets(query);
        sets = sets.data.sets;

        // Check if the set is a personal record
        if (sets.length === 0) {
            return "PR";
        }
        else {
            // Find the best set from sets (highest value, weightLoad, or elastic tension)
            const bestSet = sets.reduce((best, current) => {
                if (current.value > best.value) return current;
                if (current.weightLoad > best.weightLoad) return current;
                if (current.elastic && current.elastic.tension > best.elastic.tension) return current;
                return best;
            });

            // Check if the current set is the best set using values
            let isBestSet = true;
            if (value && bestSet.value > value) isBestSet = false;
            if (weightLoad && bestSet.weightLoad > weightLoad) isBestSet = false;
            if (elastic && elastic.use && elastic.use === "resistance") {
                if (bestSet.elastic && bestSet.elastic.tension > elastic.tension) isBestSet = false;
            }
            if (elastic && elastic.use && elastic.use === "assistance") {
                if (bestSet.elastic && bestSet.elastic.tension < elastic.tension) isBestSet = false;
            }

            if (isBestSet) {
                return "SB";
            }
        }

        return null; // Not a PR


    } catch (error) {
        console.error('Error checking for personal record:', error);
        return false; // Handle errors by returning false (not a PR)
    }
};
