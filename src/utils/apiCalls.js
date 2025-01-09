import API from "./API";

/**
 * Build favorite exercices with full details
 * @param {array} favoriteExercices 
 * @returns {array} favoriteExercices with full details
 */
async function buildFavoriteExercices(favoriteExercices) {
    // Fetch details for each exercise in parallel
    const fetchDetailsPromises = favoriteExercices.map(async (exercice) => {
        try {
            // Fetch exercise details
            const exerciceDetails = await API.getExercice({ id: exercice.exercice, fields: ["name", "_id", "type"] });

            // Fetch category details
            let categories = [];
            if (exercice.categories && exercice.categories.length > 0) {
                const categoryDetailsPromises = exercice.categories.map(async (categoryId) => {
                    const categoryDetails = await API.getCategory({ id: categoryId, fields: ["name", "_id", "type"] });
                    return {
                        category: categoryDetails.data.categoryReturned
                    };
                });

                categories = await Promise.all(categoryDetailsPromises);
            }

            // Return the exercise with fetched details
            return {
                ...exercice,
                exercice: exerciceDetails.data.exerciceReturned,
                categories: categories
            };
        } catch (error) {
            console.error("Error fetching exercise details:", error);
            throw error;
        }
    });

    // Wait for all exercises to be processed
    favoriteExercices = await Promise.all(fetchDetailsPromises);

    return favoriteExercices;
}

/**
 * Fetch favorite exercices with pagination
 * @param {string} userId 
 * @param {number} page 
 * @param {number} limit 
 * @returns {Promise} A promise that resolves to { favoriteExercices, pagination }
 */
async function fetchFavoriteExercices(userId, page = 1, limit = 5) {
    try {
        // Fetch the top exercises for the user with pagination
        const response = await API.getTopExercices({ userId, page, limit });
        let favoriteExercices = response.data.topExercices;

        favoriteExercices = await buildFavoriteExercices(favoriteExercices);

        return {
            favoriteExercices,
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error("Error fetching favorite exercices:", error);
        throw error;
    }
}


export default { fetchFavoriteExercices, buildFavoriteExercices };
