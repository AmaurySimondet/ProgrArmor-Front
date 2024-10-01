import API from './API';
import React from 'react';
import { isPersonalRecord } from './pr';

const renderSets = (sets, className = "set-item") => {
    // Count identical sets
    const setCount = sets.reduce((acc, set) => {
        const setKey = JSON.stringify({
            value: set.value,
            unit: set.unit,
            weightLoad: set.weightLoad,
            elastic: set.elastic,
        });

        if (!acc[setKey]) {
            acc[setKey] = { count: 1, type: set.type || false };
        } else {
            acc[setKey].count += 1;
            acc[setKey].PR = acc[setKey].PR || set.type;
        }

        return acc;
    }, {});

    // Render the sets
    return Object.keys(setCount).map((setKey) => {
        const { count, PR } = setCount[setKey];
        const set = JSON.parse(setKey);

        return (
            <li key={setKey}
                className={`${className} ${PR ? 'personal-record' : ''}`.trim()}
                style={PR === 'PR' ? { backgroundColor: "#e0ffe0", border: "2px solid #00c853" } : PR === "SB" ? { backgroundColor: "#fff9c4", border: "2px solid #ffeb3b" } : {}}>

                {`${count} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic && set.elastic.tension ? `Elastique: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}

                {PR && (
                    // if PR green, if SB yellow
                    <span className="pr-badge" style={PR === 'PR' ? { color: "#00c853" } : { color: "rgb(255 178 59)" }}>
                        🎉 {PR}! 🎉
                    </span>
                )}

            </li>
        );
    });
};


// Convert IDs to names using async functions
const getCategoryById = async (categoryId) => {
    try {
        const response = await API.getCategory({ id: categoryId, fields: ["name", "_id", "type"] });
        const fetchedCategory = response.data.categoryReturned
        return fetchedCategory
    } catch (error) {
        console.error("Error fetching category name:", error);
        return null;
    }
};

const getExerciseById = async (exerciseId) => {
    try {
        const response = await API.getExercice({ id: exerciseId, fields: ["name", "_id"] });
        const fetchedExercise = response.data.exerciceReturned
        return fetchedExercise
    } catch (error) {
        console.error("Error fetching exercise name:", error);
        return null;
    }
};

const getExerciseTypeById = async (exerciseTypeId) => {
    try {
        const response = await API.getExerciceType({ id: exerciseTypeId, fields: ["name", "_id"] });
        const fetchedExerciseType = response.data.exerciceTypeReturned
        return fetchedExerciseType;
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
        let categories = set.categories;

        // Convert categories IDs to category names asynchronously
        categories = await Promise.all(
            categories.map(async (categoryObject) => getCategoryById(categoryObject.category))
        );

        // Get a unique key for the exercise and category combination
        const exerciseCategoryKey = getExerciseCategoryKey(exerciseId, categories);

        // Initialize the exercise object if it doesn't exist
        if (!exercisesMap[exerciseCategoryKey]) {
            exercisesMap[exerciseCategoryKey] = {
                exercice: await getExerciseById(exerciseId),
                exerciseType: await getExerciseTypeById(set.exerciceType),
                categories: categories,
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

const seanceToSets = (seanceId, selectedExercices, userId) => {
    const seanceSets = [];

    selectedExercices.forEach((exercise, exerciseIndex) => {
        const { exercice, exerciseType, categories, sets } = exercise;
        const exerciceId = exercice._id;
        const exerciseTypeId = exerciseType._id;
        const categoryIds = categories.map(category => ({ category: category._id, categoryType: category.type }));

        sets.forEach((set, setIndex) => {
            const seanceSet = {
                user: userId,
                exercice: exerciceId,
                exerciceType: exerciseTypeId,
                categories: categoryIds,
                seance: seanceId,
                exerciceOrder: exerciseIndex + 1,
                exerciceTotal: selectedExercices.length,
                setOrder: setIndex + 1,
                setTotal: sets.length,
                unit: set.unit,
                weightLoad: set.weightLoad,
                value: set.value,
                elastic: set.elastic || null,
                PR: set.type || null,
            };

            seanceSets.push(seanceSet);
        });
    });

    return seanceSets;
};

const addPrToSets = async (selectedExercices, selectedExercice, index) => {
    const exercicesToRender = [...selectedExercices];

    // Place selectedExercice at the correct position
    if (selectedExercice && index !== null) {
        exercicesToRender.splice(index, 0, selectedExercice);
    } else if (selectedExercice) {
        exercicesToRender.push(selectedExercice);
    }

    // Check for PRs
    const exercicesWithPRStatus = await Promise.all(
        exercicesToRender.map(async (exercice) => {
            console.log('Querying PR for:', exercice.exercice.name.fr + " (" + exercice.exercice._id + ") " + exercice.categories.map((category) => (category.name.fr + " (" + category._id + ") ")).join(', '));
            const updatedSets = await Promise.all(
                exercice.sets.map(async (set) => {
                    const isPR = await isPersonalRecord(set, exercice.exercice._id, exercice.categories.map((category) => ({ category: category._id })));
                    console.log('PR status:', isPR);
                    return { ...set, PR: isPR };
                })
            );
            return { ...exercice, sets: updatedSets };
        })
    );

    return exercicesWithPRStatus;
};

export { setsToSeance, renderSets, seanceToSets, addPrToSets };
