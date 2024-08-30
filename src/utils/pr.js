import API from "./API";

export const isPersonalRecord = async (set, exercice, categories) => {
    // Extract necessary data from the set
    const { unit, value, weightLoad, elastic } = set;

    if (set.value === 0) {
        return false;
    }

    // Call the API to check if this set is a personal record
    try {
        const userId = localStorage.getItem("id");
        const query = {
            userId,
            exercice,
            categories,
            unit
        };
        if (value) query.value = { $gte: value };
        if (weightLoad) query.weightLoad = { $gte: weightLoad };
        if (elastic && elastic.use && elastic.use === "resistance") query.elastic = { tension: { $gte: elastic.tension } };
        if (elastic && elasitc.use && elastic.use === "assistance") query.elastic = { tension: { $lte: elastic.tension } };

        let sets = await API.getSeanceSets(query);
        sets = sets.data.sets;
        console.log("Sets:", sets);

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
