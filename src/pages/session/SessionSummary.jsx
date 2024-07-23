import React from 'react';

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
            <li key={idx} style={{ marginBottom: '5px' }}>
                {`${setCount[setKey]} x ${set.value} ${set.unit} ${set.charge ? `@ ${set.charge} kg` : ''} ${set.elastique.tension ? `Elastique: ${set.elastique.usage} ${set.elastique.tension} kg` : ''}`}
            </li>
        );
    });
};

const renderExercise = (exercise, index) => {
    return <div key={index} style={{ marginBottom: '10px' }}>
        <h3 style={{ color: '#9b0000' }}>
            {exercise.exercise}{exercise.categories.length > 0 && " - " + exercise.categories.join(', ')}</h3>
        {exercise.sets && exercise.sets.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {renderSets(exercise.sets)}
            </ul>
        )}
    </div>
};

const SessionSummary = ({ selectedName, selectedDate, selectedExercises, selectedExercise }) => {
    return (
        <div>
            {selectedName && selectedDate && (
                <div style={{ padding: '20px', borderBottom: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>

                    {/* Name and Date */}
                    <h2>{selectedName} - {selectedDate}</h2>

                    {/* Exercises already recorded */}
                    {selectedExercises.map((exercise, index) => renderExercise(exercise, index))}

                    {/* Currently selected exercise */}
                    {selectedExercise && renderExercise(selectedExercise, selectedExercises.length)}
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
