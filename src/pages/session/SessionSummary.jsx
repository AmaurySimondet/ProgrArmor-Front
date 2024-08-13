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
                {`${setCount[setKey]} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic.tension ? `Elastic: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}
            </li>
        );
    });
};

const renderExercice = (exercice, index, handleExerciceClick, isEditing) => {
    return (
        <div
            key={index}
            onClick={() => handleExerciceClick(index)}
            className={`sessionSummaryExercice ${isEditing ? 'editingExercice' : ''}`}
        >
            <h3 style={{ color: isEditing ? '#aaaaaa' : '#9b0000' }}>
                {exercice.exercice && exercice.exercice}{exercice.categories.length > 0 && " - " + exercice.categories.join(', ')}
            </h3>
            {exercice.sets && exercice.sets.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {renderSets(exercice.sets)}
                </ul>
            )}
        </div>
    );
};

const SessionSummary = ({ selectedName, selectedDate, selectedExercices, selectedExercice, handleExerciceClick, onFinish, index, handleDateClick }) => {
    const exercicesToRender = [...selectedExercices];

    // Place selectedExercice at the correct position
    if (selectedExercice && index !== null) {
        exercicesToRender.splice(index, 0, selectedExercice);
    } else if (selectedExercice) {
        exercicesToRender.push(selectedExercice);
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

                    {/* Exercices to be rendered */}
                    {exercicesToRender.map((exercice, idx) =>
                        renderExercice(exercice, idx, handleExerciceClick, (idx === index || (idx === selectedExercices.length && index === null)))
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
