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

const renderExercise = (exercise, index, handleExerciseClick) => {
    console.log('renderExercise', exercise, index);
    return (
        <div
            key={index}
            style={{ marginBottom: '10px', cursor: 'pointer' }}
            onClick={() => handleExerciseClick(index)}
        >
            <h3 style={{ color: '#9b0000' }}>
                {exercise.exercise && exercise.exercise + " - "}{exercise.categories && exercise.categories.join(', ')}
            </h3>
            {exercise.sets && exercise.sets.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {renderSets(exercise.sets)}
                </ul>
            )}
        </div>
    )
};

const SessionSummary = ({ selectedName, selectedDate, selectedExercises, selectedExercise, handleExerciseClick, onFinish }) => {
    return (
        <div>
            {selectedName && selectedDate && (
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>

                    {/* Name and Date */}
                    <h2>{selectedName} - {selectedDate}</h2>

                    {/* Exercises already recorded */}
                    {selectedExercises.map((exercise, index) => renderExercise(exercise, index, handleExerciseClick))}

                    {/* Current exercise */}
                    {selectedExercise && renderExercise(selectedExercise, selectedExercises.length, handleExerciseClick)}

                    {/* Finish button */}
                    <button onClick={() => onFinish()} className='btn btn-black mt-2'>
                        Séance terminée
                    </button>
                    <p className='text-muted' style={{ fontSize: '0.8em', marginTop: "1rem" }}><i >Cliquez sur un exercice pour le modifier</i></p>
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
