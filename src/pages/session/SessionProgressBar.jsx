import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Assuming you are using react-bootstrap for the progress bar

const getProgressPercentage = (selectedName, selectedDate, selectedExercises, selectedExercise) => {
    //name 20%, date 20%, exercise 15%, category 15%, sets 10%
    console.log('progressBar', selectedName, selectedDate, selectedExercises, selectedExercise);
    let progress = 0;
    if (selectedName) {
        progress += 10;
    }
    if (selectedDate) {
        progress += 10;
    }
    // exercise name chosen
    if (selectedExercise.exercise) {
        progress += 10;
    }
    // category chosen
    if (selectedExercise.categories.length > 0) {
        progress += 10;
    }
    // sets added
    if (selectedExercise.sets.length > 0) {
        progress += 10;
    }
    // exercise 1
    if (selectedExercises.length === 1) {
        progress += 20;
    }
    // exercise 2
    if (selectedExercises.length === 2) {
        progress += 40;
    }
    // exercise 3
    if (selectedExercises.length === 3) {
        progress += 60;
    }
    if (progress >= 100) {
        progress = 99;
    }
    return progress;
};

const SessionProgressBar = ({ selectedName, selectedDate, selectedExercises, selectedExercise }) => {
    const progressPercentage = getProgressPercentage(selectedName, selectedDate, selectedExercises, selectedExercise);

    return (
        <div>
            <ProgressBar animated now={progressPercentage} label={`${Math.round(progressPercentage)}%`} variant="success" className='progressBar' />
        </div>
    );
};

export default SessionProgressBar;
