import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Assuming you are using react-bootstrap for the progress bar

const getProgressPercentage = (selectedName, selectedDate, selectedExercises) => {
    //name 20%, date 20%, exercise 15%, category 15%, sets 10%
    console.log('progressBar', selectedName, selectedDate, selectedExercises);
    let progress = 0;
    if (selectedName) {
        progress += 10;
    }
    if (selectedDate) {
        progress += 10;
    }
    // count selectedExercises with exercise
    let countExercises = selectedExercises.filter(exercise => exercise.exercise).length;
    if (countExercises === 1) {
        progress += 10;
    }
    let countCategories = selectedExercises.filter(exercise => exercise.categories && exercise.categories.length > 0).length;
    if (countCategories === 1) {
        progress += 10;
    }
    if (selectedExercises.length === 2) {
        progress += 10;
    }
    if (selectedExercises.length === 3) {
        progress += 20;
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
