import { setsToSeance } from "./sets";
import { getUserById } from "./user";
import API from "./API";

/**
 * Fetches seances data from the API and updates the state with the transformed seances
 * @param {string} users - The string version of the list of user IDs to filter seances by
 * @param {number} page - The page number to fetch
 * @param {number} limit - The number of seances to fetch per page
 * @returns {Promise} A promise that resolves with the transformed seances
 */
const fetchSeancesData = async (users, page = 1, limit = 3) => {
    try {
        const response = await API.getSeances({
            users,
            page,
            limit
        });
        const seancesFetched = response.data.seances.seances;
        const hasMore = response.data.seances.hasMore;

        // Fetch seance sets for all seances
        const seanceSetsPromises = seancesFetched.map(async (seance) => {
            const seanceSetsResponse = await API.getSeanceSets({ seanceId: seance._id });
            seance.seanceSets = seanceSetsResponse.data.sets;
            return seance;
        });

        // Fetch user data for all users in the seances (for pp, name, etc)
        const userPromises = seancesFetched.map(async (seance) => {
            const userResponse = await getUserById(seance.user);
            seance.user = userResponse;
            return seance;
        });

        // Wait for all seance sets and user data to be fetched
        await Promise.all([...seanceSetsPromises, ...userPromises]);

        // Transform seanceSets to exercices
        const transformedSeancePromises = seancesFetched.map(async (seance) => {
            const transformedSeance = await setsToSeance(seance.seanceSets);
            seance.exercices = transformedSeance.exercices;
            return seance;
        });

        // Wait for all transformations to complete
        const transformedSeances = await Promise.all(transformedSeancePromises);

        // Update state with the transformed seances
        return { seances: transformedSeances, hasMore };
    } catch (error) {
        console.error("Error fetching seances data:", error);
    }
};

/**
 * Fetches a single seance's data from the API and transforms it
 * @param {string} seanceId - The ID of the seance to fetch
 * @returns {Promise} A promise that resolves with the transformed seance
 */
const fetchSeanceData = async (seanceId) => {
    try {
        console.log("fetching seance data for seanceId:", seanceId);
        const response = await API.getSeance({ id: seanceId });
        console.log("response:", response);
        const seance = response.data.seanceData;
        console.log("seance:", seance);

        // Fetch seance sets
        const seanceSetsResponse = await API.getSeanceSets({ seanceId: seance._id });
        seance.seanceSets = seanceSetsResponse.data.sets;

        // Fetch user data
        const userResponse = await getUserById(seance.user);
        seance.user = userResponse;

        // Transform seanceSets to exercices
        const transformedSeance = await setsToSeance(seance.seanceSets);
        seance.exercices = transformedSeance.exercices;

        return seance;
    } catch (error) {
        console.error("Error fetching seance data:", error);
        throw error;
    }
};

export { fetchSeancesData, fetchSeanceData };