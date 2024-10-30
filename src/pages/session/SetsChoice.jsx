import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { Tooltip } from 'react-tooltip';
import RenderExercice from './RenderExercice';
import Alert from '../../components/Alert';

const SetsChoice = ({ onBack, onNext, editingSets, exercice, index, onDelete, onGoToExerciceType, onGoToCategories }) => {
    const [sets, setSets] = useState(editingSets);
    const [unit, setUnit] = useState('repetitions'); // Default to 'repetitions'
    const [value, setValue] = useState('');
    const [weightLoad, setWeightLoad] = useState(0);
    const [elastic, setElastic] = useState({});
    const { width } = useWindowDimensions();
    const [alert, setAlert] = useState(null);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

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
        if (e.target.value === "") {
            updatedSets[index].elastic = {};
            setSets(updatedSets);
            return;
        }
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
        console.log("sets", sets);
        if (sets.length === 0) {
            showAlert("Tu n'as pas ajouté de série", "danger");
            return;
        }
        // verify that all sets have a value and weightLoad ('' or null)
        if (sets.some(set => set.value === "") || sets.some(set => typeof set.value !== "number") || sets.some(set => set.weightLoad === "") || sets.some(set => typeof set.weightLoad !== "number")) {
            showAlert("Tu n'as pas rempli tous les champs", "danger");
            return;
        }
        // verify that elastic is correctly set
        if (sets.some(set => (set.elastic?.use || set.elastic?.tension) && (set.elastic.use === "" || set.elastic.tension === "" || typeof set.elastic.tension !== "number"))) {
            showAlert("Tu n'as pas rempli tous les champs pour l'élastique", "danger");
            return;
        }
        else {
            onNext(sets);
        }
    };

    const handleCopySet = (index) => {
        const set = sets[index];
        // Create a deep copy of the set to avoid shared reference issues
        const copiedSet = JSON.parse(JSON.stringify(set));
        setSets([...sets, copiedSet]);
    };

    const handleChangeElasticTensionBegin = (e) => {
        const newElastic = { ...elastic, tension: parseFloat(e.target.value) }
        if (!newElastic.use) {
            newElastic.use = 'resistance';
        }
        setElastic(newElastic);
    }

    const handleChaneElasticUseBegin = (e) => {
        if (e.target.value === "") {
            setElastic({});
            return
        }
        setElastic({ ...elastic, use: e.target.value });
    }


    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <Tooltip id="my-tooltip" />
            <h2 style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1 style={{ marginTop: '0' }}>
                {index !== null ? "Modifier" : "Ajouter"} les séries
            </h1>

            <RenderExercice exercice={exercice} sets={sets} />

            {index !== null &&
                <div style={{
                    "display": "flex",
                    "flexDirection": "row",
                    "justifyContent": "center",
                }}>
                    <button onClick={() => onGoToExerciceType()} className='btn btn-white m-2'>
                        Modifier l'exercice
                    </button>
                    <button onClick={() => onGoToCategories()} className='btn btn-white m-2'>
                        Modifier les catégories
                    </button>
                    <button onClick={() => onDelete(index)} className='btn btn-black m-2'>
                        Supprimer l'exercice
                    </button>
                </div>
            }

            {sets.length === 0 && (
                <div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>⏱️</div>
                            <strong>Unité</strong>
                            <select className="custom-select" value={unit} onChange={(e) => setUnit(e.target.value)} style={{ maxWidth: '200px', marginTop: '5px' }}>
                                <option value="repetitions">Répetitions</option>
                                <option value="seconds">Secondes</option>
                            </select>
                        </label>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🔢</div>
                            <strong>Reps / Secs</strong>
                            <select
                                className="form-control"
                                value={value}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
                                style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                            >
                                <option value="" disabled>
                                    Nb Reps / Secs
                                </option>
                                {[...Array(3600).keys()].map((i) => (
                                    <option key={i} value={i}>
                                        {i}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className='sessionChoice'>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>⚖️ </div>
                            <strong>Charge (kg)</strong>
                            <select
                                className="form-control"
                                value={weightLoad}
                                onChange={(e) => setWeightLoad(parseFloat(e.target.value))}
                                style={{ width: '100%', maxWidth: '200px', marginTop: '5px' }}
                            >
                                <option value="" disabled>
                                    Charge (kg)
                                </option>
                                {[...Array(2000).keys()].map((i) => (
                                    <option key={i / 4} value={i / 4}>
                                        {i / 4}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className='sessionChoice' style={{ backgroundColor: '#CCCCCC' }}>
                            <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🪢</div>
                            <a
                                data-tooltip-id="my-tooltip"
                                data-tooltip-html={tooltipText}
                                data-tooltip-place="top"
                            >
                                <strong>Elastique (?)</strong>
                            </a>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                                <select className="custom-select" value={elastic.use || ""} onChange={handleChaneElasticUseBegin} style={{ width: '100%', maxWidth: '200px' }}>
                                    <option value="resistance">Résistance</option>
                                    <option value="assistance">Assistance</option>
                                    <option value="">Sans</option>
                                </select>
                                {elastic.use && (
                                    <select
                                        className="form-control"
                                        value={elastic.tension}
                                        onChange={handleChangeElasticTensionBegin}
                                        style={{ width: '100%', maxWidth: '200px' }}
                                    >
                                        <option value="" disabled>
                                            Tension (kg)
                                        </option>
                                        {[...Array(100).keys()].map((i) => (
                                            <option key={i} value={i}>
                                                {i}
                                            </option>
                                        ))}
                                    </select>
                                )}
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
                                        <select className="form-control" value={set.value} onChange={(e) => handleValueChange(index, e)} style={{ maxWidth: '75px' }}>
                                            <option value="" disabled>
                                                Nb Reps / Secs
                                            </option>
                                            {[...Array(3600).keys()].map((i) => (
                                                <option key={i} value={i}>
                                                    {i}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label >
                                        <p>⚖️ </p>
                                        <select className="form-control" value={set.weightLoad} onChange={(e) => handleWeightLoadChange(index, e)} style={{ maxWidth: '75px' }}>
                                            <option value="" disabled>
                                                Charge (kg)
                                            </option>
                                            {[...Array(2000).keys()].map((i) => (
                                                <option key={i / 4} value={i / 4}>
                                                    {i / 4}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label >
                                        <p><a
                                            data-tooltip-id="my-tooltip"
                                            data-tooltip-html={tooltipText}
                                            data-tooltip-place="top"
                                        >
                                            🪢
                                        </a>
                                        </p>
                                        <select className="custom-select" value={set.elastic?.use || ''} onChange={(e) => handleChangeElasticUse(index, e)} style={{ maxWidth: '75px' }}>
                                            <option value="resistance">Résistance</option>
                                            <option value="assistance">Assistance</option>
                                            <option value="">Sans</option>
                                        </select>
                                        {set.elastic?.use && (
                                            <select className="form-control" value={set.elastic?.tension || ''} onChange={(e) => handleChangeElasticTension(index, e)} style={{ maxWidth: '75px' }}>
                                                <option value="" disabled>
                                                    Tension (kg)
                                                </option>
                                                {[...Array(100).keys()].map((i) => (
                                                    <option key={i} value={i}>
                                                        {i}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
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
                <button onClick={handleAddSet} className='btn btn-white'>
                    Ajouter série
                </button>
                <button onClick={handleNextExercice} className='btn btn-dark'>
                    Valider
                </button>
            </div>

            <div>
                {alert && (
                    <Alert message={alert.message} type={alert.type} onClose={handleClose} />
                )}
            </div>
        </div>
    );
};

export default SetsChoice;
