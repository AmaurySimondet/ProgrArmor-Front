import API from "./API";

/**
 * Fetch top exercises for a given user with full details
 * [
 *    {
 *      "exercice": {
 *          "name": {"en": "Bench Press", "fr": "Développé couché"},
 *          "_id": "5f4f5b5c0b4a6b0017b3d5c5",
 *          "type": "5f4f5b5c0b4a6b0017b3d5c4"
 *      },
 *      "categories": [
 *          {
 *              "category": {
 *              "name": {"en": "Chest", "fr": "Pectoraux"},
 *              "_id": "5f4f5b5c0b4a6b0017b3d5c6",
 *              "type": "5f4f5b5c0b4a6b0017b3d5c4"
 *          },
 *          categoryType: "5f4f5b5c0b4a6b0017b3d5c4"
 *      ]
 *   }
 * ...
 * ]
 * @param {string} userId 
 * @returns {Promise} A promise that resolves to an array of top exercises with full details
 */
async function fetchFavoriteExercices(userId) {
    try {
        // Fetch the top exercises for the user
        const response = await API.getTopExercices({ userId });
        let favoriteExercices = response.data.topExercices;

        // Fetch details for each exercise in parallel
        const fetchDetailsPromises = favoriteExercices.map(async (exercice) => {
            try {
                // Fetch exercise details
                const exerciceDetails = await API.getExercice({ id: exercice.exercice, fields: ["name", "_id", "type"] });

                // Fetch category details
                let categories = [];
                if (exercice.categories && exercice.categories.length > 0) {
                    const categoryDetailsPromises = exercice.categories.map(async (categoryObj) => {
                        const categoryDetails = await API.getCategory({ id: categoryObj.category, fields: ["name", "_id", "type"] });
                        return {
                            ...categoryObj,
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

        // Return the final processed exercises
        return favoriteExercices;
    } catch (error) {
        console.error("Error fetching favorite exercices:", error);
        throw error;
    }
}


export default { fetchFavoriteExercices };
