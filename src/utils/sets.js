import API from './API';
import React from 'react';
import { isPersonalRecord } from './pr';
import { COLORS } from './constants';

const renderSets = (sets, hasModifications, className = "set-item") => {
    // Count identical sets
    const setCount = sets.reduce((acc, set) => {
        const setKey = JSON.stringify({
            value: set.value,
            unit: set.unit,
            weightLoad: set.weightLoad,
            elastic: set.elastic,
        });

        if (!acc[setKey]) {
            acc[setKey] = { count: 1, PR: set.PR || false };
        } else {
            acc[setKey].count += 1;
            acc[setKey].PR = acc[setKey].PR || set.PR;
        }

        return acc;
    }, {});

    // if it hasModifications, don't show PR (as it's not relevant)
    if (hasModifications) {
        return Object.keys(setCount).map((setKey) => {
            const { count, PR } = setCount[setKey];
            const set = JSON.parse(setKey);

            return (
                <li key={setKey} className={className}>
                    {`${count} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic && set.elastic.tension ? `Elastique: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}
                </li>
            );
        });
    }

    // Render the sets
    return Object.keys(setCount).map((setKey) => {
        const { count, PR } = setCount[setKey];
        const set = JSON.parse(setKey);

        return (
            <li key={setKey}
                className={`${className} ${PR ? 'personal-record' : ''}`.trim()}
                style={PR === 'PR'
                    ? { backgroundColor: COLORS.PR.background, border: `2px solid ${COLORS.PR.border}` }
                    : PR === "SB"
                        ? { backgroundColor: COLORS.SB.background, border: `2px solid ${COLORS.SB.border}` }
                        : PR === "NB"
                            ? { backgroundColor: COLORS.NB.background, border: `2px solid ${COLORS.NB.border}` }
                            : {}}>

                {`${count} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic && set.elastic.tension ? `Elastique: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}

                {PR && className !== "" && (
                    // if PR green, if SB yellow, if NB gray
                    <span className="pr-badge"
                        style={PR === 'PR'
                            ? { color: COLORS.PR.text }
                            : PR === "SB"
                                ? { color: COLORS.SB.text }
                                : PR === "NB"
                                    ? { color: COLORS.NB.text }
                                    : { color: "#666" }}>
                        {PR}
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

const getExerciseTypeById = async (exerciceTypeId) => {
    try {
        const response = await API.getExerciceType({ id: exerciceTypeId, fields: ["name", "_id"] });
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
    const categoryIds = categories.map(cat => cat._id).sort().join('-');
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
                exerciceType: await getExerciseTypeById(set.exerciceType),
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
            PR: set.PR,
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

const seanceToSets = (seanceId, selectedExercices, userId, date) => {
    const seanceSets = [];

    selectedExercices.forEach((exercise, exerciseIndex) => {
        const { exercice, exerciceType, categories, sets } = exercise;
        const exerciceId = exercice._id;
        const exerciceTypeId = exerciceType?._id || exercice.type;
        const categoryIds = categories.map(category => ({ category: category._id, categoryType: category.type }));
        const variations = [{ variation: exerciceId, type: exerciceTypeId }];
        // then add each category to the variations
        categories.forEach(category => {
            variations.push({ variation: category._id, type: category.type });
        });

        sets.forEach((set, setIndex) => {
            const seanceSet = {
                user: userId,
                exercice: exerciceId,
                exerciceType: exerciceTypeId,
                variations: variations,
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
                PR: set.PR || null,
                date: new Date(date),
            };

            seanceSets.push(seanceSet);
        });
    });

    return seanceSets;
};

const addPrToSets = async (seanceId, selectedExercices, selectedExercice, index) => {
    const exercicesToRender = [...selectedExercices];

    // Place selectedExercice at the correct position
    if (selectedExercice && index !== null) {
        exercicesToRender.splice(index, 1, selectedExercice);
    } else if (selectedExercice) {
        exercicesToRender.push(selectedExercice);
    }

    // Check for PRs
    const exercicesWithPRStatus = await Promise.all(
        exercicesToRender.map(async (exercice) => {
            // console.log('Querying PR for:', exercice.exercice.name.fr + " (" + exercice.exercice._id + ") " + exercice.categories.map((category) => (category.name.fr + " (" + category._id + ") ")).join(', '));
            const updatedSets = await Promise.all(
                exercice.sets.map(async (set) => {
                    const isPR = await isPersonalRecord(seanceId, set, exercice.exercice._id, exercice.categories.map((category) => ({ category: category._id })));
                    return { ...set, PR: isPR };
                })
            );
            return { ...exercice, sets: updatedSets };
        })
    );

    return exercicesWithPRStatus;
};

export { setsToSeance, renderSets, seanceToSets, addPrToSets };
