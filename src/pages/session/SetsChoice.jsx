import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { Tooltip } from 'react-tooltip'

const SetsChoice = ({ onBack, onNext }) => {
    const [sets, setSets] = useState([]);
    const [unit, setUnit] = useState('reps'); // Default to 'reps'
    const [value, setValue] = useState('');
    const [weightLoad, setweightLoad] = useState(0);
    const [elastic, setElastic] = useState({ use: 'resistance', tension: '' });
    const { width } = useWindowDimensions();

    const tooltipText = (
        "Valeurs classiques: </br> (Mesuré a 200% de sa taille) </br> Extra fin (<5kg)</br> Très petit (5-16kg)</br> Petit (12-24kg)</br> Moyen (12-36kg)</br> Gros (22-60kg)</br> Très gros (28-80kg)</br> Énorme (>80kg) (rare)</br> </br> Pour une mesure précise, </br> utilisez un pèse bagage </br> ou une balance de pêche."
    );

    const handleAddSet = () => {
        if (value.trim()) {
            const newSet = { unit, value, weightLoad, elastic };
            setSets([...sets, newSet]);
            // Reset fields after adding
            setValue('');
            setweightLoad(0);
            setElastic({ use: 'resistance', tension: 0 });
        }
    };

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleChangeElasticuse = (e) => {
        setElastic((prev) => ({ ...prev, use: e.target.value }));
    };

    const handleChangeElasticTension = (e) => {
        setElastic((prev) => ({ ...prev, tension: parseFloat(e.target.value) }));
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
        setSets([...sets, set]);
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <Tooltip id="my-tooltip" />
            <h2 style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1 style={{ marginTop: '0' }}>Ajouter des séries</h1>
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
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>📏</div>
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
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>💪</div>
                        Charge (kg)
                        <input
                            className="form-control"
                            type="number"
                            value={weightLoad}
                            onChange={(e) => setweightLoad(parseFloat(e.target.value))}
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
                            Elastic
                        </a>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                            <select className="custom-select" value={elastic.use} onChange={handleChangeElasticuse} style={{ width: '100%', maxWidth: '200px' }}>
                                <option value="resistance">Résistance</option>
                                <option value="assistance">Assistance</option>
                            </select>
                            <input
                                className="form-control"
                                type="number"
                                value={elastic.tension}
                                onChange={handleChangeElasticTension}
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
                            <span>{`${set.value} ${set.unit} ${set.weightLoad ? `@ ${set.weightLoad} kg` : ''} ${set.elastic.tension ? `Elastic: ${set.elastic.use} ${set.elastic.tension} kg` : ''}`}</span>
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
