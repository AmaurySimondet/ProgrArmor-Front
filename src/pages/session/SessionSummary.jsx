import React, { useEffect, useState } from 'react';
import { isPersonalRecord } from '../../utils/pr';
import { renderSetsWithPR } from '../../utils/sets';

const SessionSummary = ({ selectedName, selectedDate, selectedExercices, selectedExercice, handleExerciceClick, onFinish, index, handleDateClick, handleNameClick, onNewExercice }) => {
    const [exercicesWithPR, setExercicesWithPR] = useState([]);

    useEffect(() => {
        const preprocessExercices = async () => {
            const exercicesToRender = [...selectedExercices];

            // Place selectedExercice at the correct position
            if (selectedExercice && index !== null) {
                exercicesToRender.splice(index, 0, selectedExercice);
            } else if (selectedExercice) {
                exercicesToRender.push(selectedExercice);
            }

            // Check for PRs
            const exercicesWithPRStatus = await Promise.all(
                exercicesToRender.map(async (exercice) => {
                    const updatedSets = await Promise.all(
                        exercice.sets.map(async (set) => {
                            const isPR = await isPersonalRecord(set);
                            return { ...set, isPR };
                        })
                    );
                    return { ...exercice, sets: updatedSets };
                })
            );

            setExercicesWithPR(exercicesWithPRStatus);
        };

        preprocessExercices();
    }, [selectedExercices, selectedExercice, index]);

    return (
        <div>
            {selectedName && selectedDate && (
                <div className='sessionSummary'>

                    {/* Name and Date */}
                    <h2 className='popInElement'>
                        <span onClick={handleNameClick} className='clickable'> {selectedName}</span>
                        -
                        <span onClick={handleDateClick} className='clickable'>{selectedDate}</span>
                    </h2>

                    <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '10px' }}>
                        {exercicesWithPR.map((exercice, idx) =>
                            <div
                                key={idx}
                                onClick={() => handleExerciceClick(index !== null && idx > index ? idx - 1 : idx)}
                                className={"sessionSummaryExercice"}
                            >
                                <h3 className={idx === index ? 'clickable' : "clickable prograrmor-red"}>
                                    {idx === index && "---> "}{index !== null && idx === index + 1 && "<--- "}{exercice.exercice && exercice.exercice}{exercice.categories.length > 0 && " - " + exercice.categories.join(', ')}
                                </h3>
                                {exercice.sets && exercice.sets.length > 0 && (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: "-webkit-center" }}>
                                        {renderSetsWithPR(exercice.sets)}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                        <button onClick={() => onNewExercice()} className='btn btn-white mt-2 popInElement'>
                            Ajouter un exercice
                        </button>
                        <button onClick={() => onFinish()} className='btn btn-black mt-2 popInElement'>
                            Séance terminée
                        </button>
                    </div>

                    <p className='text-muted popInElement' style={{ fontSize: '0.8em', marginTop: "1rem" }}>
                        <i>Tu peux slider à travers les exercices</i>
                        <br />
                        <i>Clique sur le nom, la date ou l'exercice pour modifier</i>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
