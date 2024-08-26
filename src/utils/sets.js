import API from './API';

const countSets = (sets) => {
    const setCount = {};
    sets.forEach(set => {
        const setKey = JSON.stringify(set);
        setCount[setKey] = (setCount[setKey] || 0) + 1;
    });
    return setCount;
};

const renderSets = (sets) => {
    const setCount = countSets(sets);
    return Object.keys(setCount).map((setKey, idx) => {
        const set = JSON.parse(setKey);
        return (
            <li key={idx} style={{ marginBottom: '5px' }} className='popInElement'>
                {`${setCount[setKey]} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic && set.elastic.tension ? `Elastic: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}
            </li>
        );
    });
};

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

// Helper function to get a unique key for exercise-category combinations
const getExerciseCategoryKey = (exerciseId, categories) => {
    // Convert categories to a string sorted by category ID to ensure uniqueness
    const categoryIds = categories.map(cat => cat.category).sort().join('-');
    return `${exerciseId}-${categoryIds}`;
};

// Transform session sets into a seance
const setsToSeance = async (sessionSets, name, date) => {
    // Group sets by exercise and category combination
    const exercisesMap = {};

    for (const set of sessionSets) {
        const exerciseId = set.exercice;
        const categories = set.categories;

        // Convert categories IDs to category names asynchronously
        const categoriesNames = await Promise.all(
            categories.map(async (categoryObject) => getCategoryNameById(categoryObject.category))
        );

        // Get a unique key for the exercise and category combination
        const exerciseCategoryKey = getExerciseCategoryKey(exerciseId, categories);

        // Initialize the exercise object if it doesn't exist
        if (!exercisesMap[exerciseCategoryKey]) {
            exercisesMap[exerciseCategoryKey] = {
                exercice: await getExerciseNameById(exerciseId),
                exerciseType: await getExerciseTypeNameById(set.exerciceType),
                categories: categoriesNames,
                sets: [],
            };
        }

        // Add the set to the exercise's sets list for the corresponding category combination
        exercisesMap[exerciseCategoryKey].sets.push({
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


export { setsToSeance, renderSets };
