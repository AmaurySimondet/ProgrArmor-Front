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
            <li key={idx} style={{ marginBottom: '5px' }} className='popInElement'>
                {`${setCount[setKey]} x ${set.value} ${set.unit} ${set.charge ? `@ ${set.charge} kg` : ''} ${set.elastique.tension ? `Elastique: ${set.elastique.usage} ${set.elastique.tension} kg` : ''}`}
            </li>
        );
    });
};

const renderExercise = (exercise, index, handleExerciseClick, isEditing) => {
    return (
        <div
            key={index}
            onClick={() => handleExerciseClick(index)}
            className={`sessionSummaryExercise ${isEditing ? 'editingExercise' : ''}`}
        >
            <h3 style={{ color: isEditing ? '#aaaaaa' : '#9b0000' }}>
                {exercise.exercise && exercise.exercise}{exercise.categories.length > 0 && " - " + exercise.categories.join(', ')}
            </h3>
            {exercise.sets && exercise.sets.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {renderSets(exercise.sets)}
                </ul>
            )}
        </div>
    );
};

const SessionSummary = ({ selectedName, selectedDate, selectedExercises, selectedExercise, handleExerciseClick, onFinish, index, handleDateClick }) => {
    const exercisesToRender = [...selectedExercises];

    // Place selectedExercise at the correct position
    if (selectedExercise && index !== null) {
        exercisesToRender.splice(index, 0, selectedExercise);
    } else if (selectedExercise) {
        exercisesToRender.push(selectedExercise);
    }

    return (
        <div>
            {selectedName && selectedDate && (
                <div className='sessionSummary'>

                    {/* Name and Date */}
                    <h2 className='popInElement'>{selectedName} - <span onClick={handleDateClick} className='clickable'>{selectedDate}</span></h2>
                    {index !== null && (
                        <div className='popInElement'>
                            <h3 style={{ color: '#aaaaaa' }}>Exercice {index + 1} en cours d'édition</h3>
                        </div>
                    )}

                    {/* Exercises to be rendered */}
                    {exercisesToRender.map((exercise, idx) =>
                        renderExercise(exercise, idx, handleExerciseClick, (idx === index || (idx === selectedExercises.length && index === null)))
                    )}

                    {/* Finish button */}
                    <button onClick={() => onFinish()} className='btn btn-black mt-2 popInElement'>
                        Séance terminée
                    </button>
                    <p className='text-muted popInElement' style={{ fontSize: '0.8em', marginTop: "1rem" }}><i >Cliquez sur la date ou l'exercice pour modifier</i></p>
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
