import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { Tooltip } from 'react-tooltip';
import RenderExercice from './RenderExercice';

const SetsChoice = ({ onBack, onNext, editingSets, exercice, index }) => {
    const [sets, setSets] = useState(editingSets);
    const [unit, setUnit] = useState('reps'); // Default to 'reps'
    const [value, setValue] = useState('');
    const [weightLoad, setWeightLoad] = useState(0);
    const [elastic, setElastic] = useState({});
    const { width } = useWindowDimensions();

    const tooltipText = (
        "Valeurs classiques: </br> (Mesuré a 200% de sa taille) </br> Extra fin (<5kg)</br> Très petit (5-16kg)</br> Petit (12-24kg)</br> Moyen (12-36kg)</br> Gros (22-60kg)</br> Très gros (28-80kg)</br> Énorme (>80kg) (rare)</br> </br> Pour une mesure précise, </br> utilisez un pèse bagage </br> ou une balance de pêche."
    );

    const handleAddSet = () => {
        const newSet = { unit, value, weightLoad, elastic };
        setSets([...sets, newSet]);
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleChangeElasticUse = (index, e) => {
        const updatedSets = [...sets];
        updatedSets[index].elastic.use = e.target.value;
        setSets(updatedSets);
    };

    const handleChangeElasticTension = (index, e) => {
        const updatedSets = [...sets];
        updatedSets[index].elastic = { ...updatedSets[index].elastic, tension: parseFloat(e.target.value) };
        // if elastic use is not set, set it to resistance
        if (!updatedSets[index].elastic.use) {
            updatedSets[index].elastic.use = 'resistance';
        }
        setSets(updatedSets);
    };

    const handleUnitChange = (index, e) => {
        const updatedSets = [...sets];
        updatedSets[index].unit = e.target.value;
        setSets(updatedSets);
    };

    const handleValueChange = (index, e) => {
        const updatedSets = [...sets];
        updatedSets[index].value = parseFloat(e.target.value);
        setSets(updatedSets);
    };

    const handleWeightLoadChange = (index, e) => {
        const updatedSets = [...sets];
        updatedSets[index].weightLoad = parseFloat(e.target.value);
        setSets(updatedSets);
    };

    const handleNextExercice = () => {
        if (sets.length === 0) {
            alert('Veuillez ajouter au moins une série');
        } else {
            onNext(sets);
        }
    };

    const handleCopySet = (index) => {
        const set = sets[index];
        // Create a deep copy of the set to avoid shared reference issues
        const copiedSet = JSON.parse(JSON.stringify(set));
        setSets([...sets, copiedSet]);
    };


    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <Tooltip id="my-tooltip" />
            <h2 style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1 style={{ marginTop: '0' }}>
                {index !== null ? "Modifier" : "Ajouter"} les séries
            </h1>

            <RenderExercice exercice={exercice} />

            {sets.length === 0 && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>⏱️</div>
                            Unité
                            <select className="custom-select" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ maxWidth: '200px', marginTop: '5px' }}>
                                <option value="repetitions">Répetitions</option>
                                <option value="seconds">Secondes</option>
                            </select>
                        </label>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🔢</div>
                            Valeur
                            <input
                                className="form-control"
                                type="number"
                                value={value}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
                                placeholder="Nb Reps / Secs"
                                style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                                inputMode='numeric'
                            />
                        </label>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>⚖️ </div>
                            Charge (kg)
                            <input
                                className="form-control"
                                type="number"
                                value={weightLoad}
                                onChange={(e) => setWeightLoad(parseFloat(e.target.value))}
                                placeholder="Charge (kg)"
                                style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                                inputMode='numeric'
                            />
                        </label>
                        <label className='sessionChoice' style={{ backgroundColor: '#CCCCCC' }}>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🪢</div>
                            <a
                                data-tooltip-id="my-tooltip"
                                data-tooltip-html={tooltipText}
                                data-tooltip-place="top"
                            >
                                Elastique
                            </a>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                                <select className="custom-select" value={elastic.use} onChange={(e) => setElastic((prev) => ({ ...prev, use: e.target.value }))} style={{ width: '100%', maxWidth: '200px' }}>
                                    <option value="resistance">Résistance</option>
                                    <option value="assistance">Assistance</option>
                                </select>
                                <input
                                    className="form-control"
                                    type="number"
                                    value={elastic.tension}
                                    onChange={(e) => setElastic((prev) => ({ ...prev, tension: parseFloat(e.target.value) }))}
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
            )}


            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {sets.length > 0 ? (
                    sets.map((set, index) => (
                        <div key={index} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                    <label >
                                        <p>⏱️</p>
                                        <select className="custom-select" value={set.unit} onChange={(e) => handleUnitChange(index, e)} style={{ maxWidth: '75px' }}>
                                            <option value="repetitions">Répetitions</option>
                                            <option value="seconds">Secondes</option>
                                        </select>
                                    </label>
                                    <label >
                                        <p>🔢</p>
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={set.value}
                                            onChange={(e) => handleValueChange(index, e)}
                                            style={{ maxWidth: '75px' }}
                                            inputMode='numeric'
                                        />
                                    </label>
                                    <label >
                                        <p>⚖️ </p>
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={set.weightLoad}
                                            onChange={(e) => handleWeightLoadChange(index, e)}
                                            style={{ maxWidth: '75px' }}
                                            inputMode='numeric'
                                        />
                                    </label>
                                    <label >
                                        <p>🪢</p>
                                        <select className="custom-select" value={set.elastic?.use || ''} onChange={(e) => handleChangeElasticUse(index, e)} style={{ maxWidth: '75px' }}>
                                            <option value="resistance">Résistance</option>
                                            <option value="assistance">Assistance</option>
                                        </select>
                                        <input
                                            className="form-control"
                                            type="number"
                                            value={set.elastic?.tension || ''}
                                            onChange={(e) => handleChangeElasticTension(index, e)}
                                            style={{ maxWidth: '75px' }}
                                            inputMode='numeric'
                                        />
                                    </label>
                                </div>
                            </div>
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
                <button onClick={handleNextExercice} className='btn btn-dark'>
                    Valider
                </button>
            </div>
        </div>
    );
};

export default SetsChoice;
