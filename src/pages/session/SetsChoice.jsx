import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';

const SetsChoice = ({ onBack, onNext }) => {
    const [sets, setSets] = useState([]);
    const [unit, setUnit] = useState('reps'); // Default to 'reps'
    const [value, setValue] = useState('');
    const [charge, setCharge] = useState(0);
    const [elastique, setElastique] = useState({ usage: 'resistance', tension: '' });
    const { width } = useWindowDimensions();

    const handleAddSet = () => {
        if (value.trim()) {
            const newSet = { unit, value, charge, elastique };
            setSets([...sets, newSet]);
            // Reset fields after adding
            setValue('');
            setCharge(0);
            setElastique({ usage: 'resistance', tension: '' });
        }
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleChangeElastiqueUsage = (e) => {
        setElastique((prev) => ({ ...prev, usage: e.target.value }));
    };

    const handleChangeElastiqueTension = (e) => {
        setElastique((prev) => ({ ...prev, tension: e.target.value }));
    };

    const handleNextExercise = () => {
        onNext(sets);
    };

    const handleCopySet = (index) => {
        const set = sets[index];
        setSets([...sets, set]);
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2
                    onClick={onBack}
                    style={{ cursor: 'pointer', color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    &lt; Retour
                </h2>
            </div>
            <h1 style={{ marginTop: '0' }}>Ajouter des séries</h1>
            <div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <label className='sessionChoice'>
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>⏱️</div>
                        Unité
                        <select className="custom-select" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ maxWidth: '200px', marginTop: '5px' }}>
                            <option value="reps">Répetitions</option>
                            <option value="seconds">Secondes</option>
                        </select>
                    </label>
                    <label className='sessionChoice'>
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>📏</div>
                        Valeur
                        <input
                            className="form-control"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Nb Reps / Secs"
                            style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                            inputMode='numeric'
                        />
                    </label>
                    <label className='sessionChoice'>
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>💪</div>
                        Charge (kg)
                        <input
                            className="form-control"
                            type="number"
                            value={charge}
                            onChange={(e) => setCharge(e.target.value)}
                            placeholder="Charge (kg)"
                            style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                            inputMode='numeric'
                        />
                    </label>
                    <label className='sessionChoice' style={{ backgroundColor: '#CCCCCC' }}>
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🪢</div>
                        Elastique
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                            <select className="custom-select" value={elastique.usage} onChange={handleChangeElastiqueUsage} style={{ width: '100%', maxWidth: '200px' }}>
                                <option value="resistance">Résistance</option>
                                <option value="assistance">Assistance</option>
                            </select>
                            <input
                                className="form-control"
                                type="number"
                                value={elastique.tension}
                                onChange={handleChangeElastiqueTension}
                                placeholder="Tension (kg)"
                                style={{ width: '100%', maxWidth: '200px' }}
                                inputMode='numeric'
                            />
                        </div>
                    </label>
                </div>
                <button onClick={handleAddSet} className='btn btn-dark mt-2' style={{ marginBottom: '20px' }}>
                    Ajouter série
                </button>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {sets.length > 0 ? (
                    sets.map((set, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                            <span>{`${set.value} ${set.unit} ${set.charge ? `@ ${set.charge} kg` : ''} ${set.elastique.tension ? `Elastique: ${set.elastique.usage} ${set.elastique.tension} kg` : ''}`}</span>
                            <div style={{
                                display: "flex",
                                gap: "10px",
                                flexWrap: "wrap",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row"
                            }}>
                                <button onClick={() => handleCopySet(index)} className='btn btn-white'>
                                    Recopier
                                </button>
                                <button onClick={() => handleRemoveSet(index)} className='btn btn-dark'>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Aucune série ajoutée</p>
                )}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={handleNextExercise} className='btn btn-dark'>
                    Exercice suivant
                </button>
            </div>
        </div >
    );
};

export default SetsChoice;
