import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar'; // Assuming you are using react-bootstrap for the progress bar

const getProgressPercentage = (selectedName, selectedDate, selectedExercices, selectedExercice) => {
    //name 20%, date 20%, exercice 15%, category 15%, sets 10%
    let progress = 0;
    if (selectedName) {
        progress += 10;
    }
    if (selectedDate) {
        progress += 10;
    }
    // exercice name chosen
    if (selectedExercice.exercice) {
        progress += 10;
    }
    // category chosen
    if (selectedExercice.categories.length > 0) {
        progress += 10;
    }
    // sets added
    if (selectedExercice.sets.length > 0) {
        progress += 10;
    }
    // exercice 1
    if (selectedExercices.length === 1) {
        progress += 20;
    }
    // exercice 2
    if (selectedExercices.length === 2) {
        progress += 40;
    }
    // exercice 3
    if (selectedExercices.length === 3) {
        progress += 60;
    }
    if (selectedExercices.length >= 4) {
        progress += 80;
    }
    if (progress >= 100) {
        progress = 90;
    }
    return progress;
};

const SessionProgressBar = ({ selectedName, selectedDate, selectedExercices, selectedExercice }) => {
    const progressPercentage = getProgressPercentage(selectedName, selectedDate, selectedExercices, selectedExercice);

    return (
        <div>
            <ProgressBar animated now={progressPercentage} label={`${Math.round(progressPercentage)}%`} variant="success" className='progressBar' />
        </div>
    );
};

export default SessionProgressBar;
