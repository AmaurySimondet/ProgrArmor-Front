import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Assuming you are using react-bootstrap for the progress bar

const getProgressPercentage = (selectedName, selectedDate, selectedExercises, selectedExercise) => {
    //name 20%, date 20%, exercise 15%, category 15%, sets 10%
    let progress = 0;
    if (selectedName) {
        progress += 10;
    }
    if (selectedDate) {
        progress += 10;
    }
    if (selectedExercise || selectedExercises.length > 0) {
        progress += 20;
    }
    if ((selectedExercise && selectedExercise.categories && selectedExercise.categories.length > 0) || (selectedExercises && selectedExercises.length > 0)) {
        progress += 20;
    }
    if ((selectedExercise && selectedExercise.sets && selectedExercise.sets.length > 0) || (selectedExercises && selectedExercises.length > 0)) {
        progress += 10;
    }
    return progress;
};

const SessionProgressBar = ({ selectedName, selectedDate, selectedExercises, selectedExercise }) => {
    const progressPercentage = getProgressPercentage(selectedName, selectedDate, selectedExercises, selectedExercise);

    return (
        <div>
            <ProgressBar animated now={progressPercentage} label={`${Math.round(progressPercentage)}%`} variant="success" />
        </div>
    );
};

export default SessionProgressBar;
