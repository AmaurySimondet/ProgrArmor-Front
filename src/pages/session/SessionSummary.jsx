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
                {`${setCount[setKey]} x ${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic && set.elastic.tension ? `Elastic: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}
            </li>
        );
    });
};

const renderExercice = (exercice, idx, handleExerciceClick, index) => {
    return (
        <div
            key={idx}
            onClick={() => handleExerciceClick(index !== null && idx > index ? idx - 1 : idx)}
            className={"sessionSummaryExercice"}
        >
            <h3 className={idx === index ? 'clickable' : "clickable prograrmor-red"}>
                {idx === index && "---> "}{index !== null && idx === index + 1 && "<--- "}{exercice.exercice && exercice.exercice}{exercice.categories.length > 0 && " - " + exercice.categories.join(', ')}
            </h3>
            {exercice.sets && exercice.sets.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {renderSets(exercice.sets)}
                </ul>
            )}
        </div>
    );
};

const SessionSummary = ({ selectedName, selectedDate, selectedExercices, selectedExercice, handleExerciceClick, onFinish, index, handleDateClick, onNewExercice }) => {
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

                    {/* Exercices to be rendered */}
                    {exercicesToRender.map((exercice, idx) =>
                        renderExercice(exercice, idx, handleExerciceClick, index)
                    )}

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                        <button onClick={() => onNewExercice()} className='btn btn-white mt-2 popInElement'>
                            Ajouter un exercice
                        </button>
                        <button onClick={() => onFinish()} className='btn btn-black mt-2 popInElement'>
                            Séance terminée
                        </button>
                    </div>
                    <p className='text-muted popInElement' style={{ fontSize: '0.8em', marginTop: "1rem" }}><i >Cliquez sur la date ou l'exercice pour modifier</i></p>
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
