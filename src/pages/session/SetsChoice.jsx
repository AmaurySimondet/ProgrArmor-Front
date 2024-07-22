import React, { useState } from 'react';

const SetsChoice = ({ onBack, onNext, onFinish }) => {
    const [sets, setSets] = useState([]);
    const [unit, setUnit] = useState('reps'); // Default to 'reps'
    const [value, setValue] = useState('');
    const [charge, setCharge] = useState(0);
    const [elastic, setElastic] = useState({ usage: 'resistance', tension: '' });
    const [currentIndex, setCurrentIndex] = useState(null);

    const handleAddSet = () => {
        if (value.trim()) {
            const newSet = { unit, value, charge, elastic };
            setSets([...sets, newSet]);
            // Reset fields after adding
            setValue('');
            setCharge(0);
            setElastic({ usage: 'resistance', tension: '' });
        }
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleChangeElasticUsage = (e) => {
        setElastic((prev) => ({ ...prev, usage: e.target.value }));
    };

    const handleChangeElasticTension = (e) => {
        setElastic((prev) => ({ ...prev, tension: e.target.value }));
    };

    const handleNextExercise = () => {
        onNext(); // Proceed to choose the next exercise
    };

    const handleFinish = () => {
        onFinish(); // Finish and save the session
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                &lt; Retour
            </h2>
            <h1>Ajouter des séries</h1>
            <div>
                <div>
                    <label>
                        Unité:
                        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                            <option value="reps">Repetitions</option>
                            <option value="seconds">Seconds</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Valeur:
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Nombre de reps / secondes"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Charge:
                        <input
                            type="number"
                            value={charge}
                            onChange={(e) => setCharge(e.target.value)}
                            placeholder="Charge en kg"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Elastic:
                        <select value={elastic.usage} onChange={handleChangeElasticUsage}>
                            <option value="resistance">Résistance</option>
                            <option value="assistance">Assistance</option>
                        </select>
                    </label>
                    <input
                        type="number"
                        value={elastic.tension}
                        onChange={handleChangeElasticTension}
                        placeholder="Tension en kg"
                    />
                </div>
                <button onClick={handleAddSet} style={{ marginTop: '10px' }}>
                    Ajouter série
                </button>
            </div>
            <div style={{ marginTop: '20px' }}>
                {sets.map((set, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <span>{`${set.value} ${set.unit} ${set.charge ? `@ ${set.charge} kg` : ''} ${set.elastic.tension ? `Elastic: ${set.elastic.usage} ${set.elastic.tension} kg` : ''}`}</span>
                        <button onClick={() => handleRemoveSet(index)} style={{ marginLeft: '10px' }}>
                            -
                        </button>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '20px' }}>
                <button onClick={handleNextExercise} style={{ marginRight: '10px' }}>
                    Exercice suivant
                </button>
                <button onClick={handleFinish}>
                    Seance terminée
                </button>
            </div>
        </div>
    );
};

export default SetsChoice;
