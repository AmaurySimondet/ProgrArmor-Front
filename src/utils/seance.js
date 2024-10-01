import { setsToSeance } from "./sets";
import { getUserById } from "./user";
import API from "./API";

/**
 * Fetches seances data from the API and updates the state with the transformed seances
 * @returns {Promise} A promise that resolves with the transformed seances
 */
const fetchSeancesData = async () => {
    try {
        const response = await API.getSeances();
        const seancesFetched = response.data.seances;

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
        return transformedSeances;
    } catch (error) {
        console.error("Error fetching seances data:", error);
    }
};

export { fetchSeancesData };