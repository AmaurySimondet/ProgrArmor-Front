import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';

const getProgressPercentage = (mealName, mealDateTime, selectedFood) => {
    let progress = 0;

    // Name adds 30%
    if (mealName) {
        progress += 30;
    }

    // DateTime adds 30%
    if (mealDateTime) {
        progress += 30;
    }

    // Selected food adds 40%
    if (selectedFood) {
        progress += 40;
    }

    return progress;
};

const MealProgressBar = ({ mealName, mealDateTime, selectedFood }) => {
    const progressPercentage = getProgressPercentage(mealName, mealDateTime, selectedFood);

    return (
        <div>
            <ProgressBar
                animated
                now={progressPercentage}
                label={`${Math.round(progressPercentage)}%`}
                variant="success"
                className='progressBar'
            />
        </div>
    );
};

export default MealProgressBar; 