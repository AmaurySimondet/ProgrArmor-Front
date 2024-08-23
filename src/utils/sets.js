import API from './API';

// Convert IDs to names using async functions
const getCategoryNameById = async (categoryId) => {
    try {
        const response = await API.getCategory({ id: categoryId });
        const fetchedCategory = response.data.categoryReturned
        return fetchedCategory.name.fr;
    } catch (error) {
        console.error("Error fetching category name:", error);
        return null;
    }
};

const getCategoryTypeNameById = async (categoryTypeId) => {
    try {
        const response = await API.getCategorieType({ id: categoryTypeId });
        const fetchedCategoryType = response.data.categorieTypeReturned
        return fetchedCategoryType.name.fr;
    } catch (error) {
        console.error("Error fetching category type name:", error);
        return null;
    }
};

const getExerciseNameById = async (exerciseId) => {
    try {
        const response = await API.getExercice({ id: exerciseId });
        const fetchedExercise = response.data.exerciceReturned
        return fetchedExercise.name.fr;
    } catch (error) {
        console.error("Error fetching exercise name:", error);
        return null;
    }
};

const getExerciseTypeNameById = async (exerciseTypeId) => {
    try {
        const response = await API.getExerciceType({ id: exerciseTypeId });
        const fetchedExerciseType = response.data.exerciceTypeReturned
        return fetchedExerciseType.name.fr;
    } catch (error) {
        console.error("Error fetching exercise type name:", error);
        return null;
    }
};

// Transform session sets into a seance
const setsToSeance = async (sessionSets, name, date) => {
    // Group sets by exercise
    const exercisesMap = {};

    for (const set of sessionSets) {
        const exerciseId = set.exercice;
        const categories = set.categories;

        // Convert categories IDs to category names asynchronously
        const categoriesNames = await Promise.all(categories.map(async (categoryObject) => (getCategoryNameById(categoryObject.category))));

        // Initialize the exercise object if it doesn't exist
        if (!exercisesMap[exerciseId]) {
            exercisesMap[exerciseId] = {
                exercice: await getExerciseNameById(exerciseId),
                exerciseType: await getExerciseTypeNameById(set.exerciceType),
                categories: categoriesNames,
                sets: [],
            };
        }

        // Add the set to the exercise's sets list
        exercisesMap[exerciseId].sets.push({
            unit: set.unit,
            value: set.value,
            weightLoad: set.weightLoad,
            elastic: set.elastic, // Maintain the elastic object if available
        });
    }

    // Convert the exercisesMap to an array of exercises
    const exercises = Object.values(exercisesMap);

    // Create the seance object
    const seance = {
        name: name,
        date: date,
        exercices: exercises,
    };

    return seance;
};

export { setsToSeance };
