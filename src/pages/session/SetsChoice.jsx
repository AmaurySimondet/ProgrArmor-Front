import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { Tooltip } from 'react-tooltip';
import RenderExercice from './RenderExercice';
import Alert from '../../components/Alert';
import API from '../../utils/API';
import { MiniLoader } from '../../components/Loader';

const GranularitySelector = ({ granularity, onChange }) => {
    return <div className="dropdown">
        <button
            className="btn p-0 rotating-gear"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ fontSize: '0.8rem', color: '#666' }}
        >
            ⚙️
        </button>
        <ul className="dropdown-menu dropdown-menu-end">
            <li className="px-3 py-2">
                <small>Précision</small>
                <select
                    className="form-control form-control-sm"
                    value={granularity}
                    onChange={onChange}
                >
                    <option value={0.1}>0.1 kg</option>
                    <option value={0.25}>0.25 kg</option>
                    <option value={0.5}>0.5 kg</option>
                    <option value={1}>1 kg</option>
                </select>
            </li>
        </ul>
    </div>
}

const SetsChoice = ({ onBack, onNext, editingSets, exercice, index, onDelete, onGoToExerciceType, onGoToCategories }) => {
    const [sets, setSets] = useState([{
        unit: 'repetitions',
        value: 0,
        weightLoad: 0,
        elastic: null,
        PR: null
    }]);
    const { width } = useWindowDimensions();
    const [alert, setAlert] = useState(null);
    const [topFormats, setTopFormats] = useState([]);
    const [topFormatWeight, setTopFormatWeight] = useState(0);
    const [granularity, setGranularity] = useState(() => {
        if (!editingSets) return 1;

        // Get all decimal parts from weightLoads
        const decimalParts = editingSets
            .map(set => set.weightLoad % 1)  // Get decimal part only
            .filter(decimal => decimal > 0);  // Ignore whole numbers

        if (decimalParts.length === 0) return 1;  // All whole numbers

        // Find the smallest non-zero decimal
        const smallestDecimal = Math.min(...decimalParts);

        // Match to closest standard granularity
        if (smallestDecimal <= 0.1) return 0.1;
        if (smallestDecimal <= 0.25) return 0.25;
        if (smallestDecimal <= 0.5) return 0.5;
        return 1;
    });
    const [tensionOptions, setTensionOptions] = useState([]);
    const [weightLoadOptions, setWeightLoadOptions] = useState([]);
    const [topFormatsPage, setTopFormatsPage] = useState(1);
    const [hasMoreFormats, setHasMoreFormats] = useState(true);
    const [loadingMoreFormats, setLoadingMoreFormats] = useState(false);

    useEffect(() => {
        console.log("sets", sets);
        console.log("editingSets", editingSets);
    }, [editingSets, sets]);

    useEffect(() => {
        API.getTopFormat({ userId: localStorage.getItem('id') }).then(response => {
            let res = response.data.topFormat || [];
            res = res.map(doc => {
                return {
                    ...doc,
                    sets: doc.format.length,
                    reps: [...new Set(doc.format)][0],
                }
            });
            setTopFormats(res);
            setHasMoreFormats(response.data.pagination.hasMore);
        }).catch(error => {
            console.error("Error fetching top formats:", error);
        });
    }, [exercice]);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    const tooltipText = (
        "Valeurs classiques: </br> (Mesuré a 200% de sa taille) </br> Extra fin (<5kg)</br> Très petit (5-16kg)</br> Petit (12-24kg)</br> Moyen (12-36kg)</br> Gros (22-60kg)</br> Très gros (28-80kg)</br> Énorme (>80kg) (rare)</br> </br> Pour une mesure précise, </br> utilisez un pèse bagage </br> ou une balance de pêche."
    );

    const handleRemoveSet = (index) => {
        setSets(sets.filter((_, i) => i !== index));
    };

    const handleChangeElasticUse = (index, e) => {
        const updatedSets = [...sets];
        if (e.target.value === "") {
            updatedSets[index].elastic = null;
            setSets(updatedSets);
            return;
        }
        if (!updatedSets[index].elastic) {
            updatedSets[index].elastic = {};
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

    const handleTopFormatSelect = (format) => {
        // Create sets based on the format
        const newSets = format.format.map((value) => {
            return {
                unit: format.unit,
                value: value,
                weightLoad: topFormatWeight,
                elastic: null
            }
        });
        setSets(newSets);
    }

    const handleGranularityChange = (e) => {
        setGranularity(parseFloat(e.target.value));
    }

    useEffect(() => {
        setWeightLoadOptions([...Array(2000).keys()].map((i) => Number((i * granularity).toFixed(2))));
        setTensionOptions([...Array(100).keys()].map((i) => Number((i * granularity).toFixed(2))));
    }, [granularity]);

    useEffect(() => {
        setSets(editingSets.length > 0 ? editingSets : [{
            unit: 'repetitions',
            value: 0,
            weightLoad: 0,
            elastic: null,
            PR: null
        }]);
    }, [editingSets]);

    const loadMoreFormats = async () => {
        if (loadingMoreFormats || !hasMoreFormats) return;

        try {
            setLoadingMoreFormats(true);
            const nextPage = topFormatsPage + 1;

            const response = await API.getTopFormat({
                userId: localStorage.getItem('id'),
                page: nextPage,
                limit: 5
            });

            let newFormats = response.data.topFormat || [];
            newFormats = newFormats.map(doc => ({
                ...doc,
                sets: doc.format.length,
                reps: [...new Set(doc.format)][0],
            }));

            setTopFormats(prev => [...prev, ...newFormats]);
            setHasMoreFormats(response.data.pagination.hasMore);
            setTopFormatsPage(nextPage);
        } catch (error) {
            console.error("Error loading more formats:", error);
        } finally {
            setLoadingMoreFormats(false);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <Tooltip id="my-tooltip" />
            <h1 style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1 style={{ margin: '20px' }}>
                {index !== null ? "Modifier" : "Ajouter"} les séries
            </h1>

            <RenderExercice exercice={exercice} sets={sets} />

            {exercice !== null &&
                <div style={{
                    "display": "flex",
                    "flexDirection": "row",
                    "justifyContent": "center",
                    "marginBottom": "20px"
                }}>
                    <button onClick={() => onGoToExerciceType()} className='btn btn-black m-2'>
                        Modifier l'exercice
                    </button>
                    <button onClick={() => onGoToCategories()} className='btn btn-black m-2'>
                        Modifier les détails
                    </button>
                    <button onClick={() => onDelete(index)} className='btn btn-white m-2'>
                        Supprimer l'exercice
                    </button>
                </div>
            }

            {/*Top Formats */}
            {topFormats.length > 0 &&
                <div>
                    <h3 style={{ color: '#9b0000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        Formats les plus utilisés
                        <GranularitySelector granularity={granularity} onChange={handleGranularityChange} />
                    </h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            maxWidth: '95vw',
                            maxHeight: '250px',
                            overflowX: 'scroll',  // Enable horizontal scrolling
                            overflowY: 'hidden',
                            whiteSpace: 'nowrap',  // Prevent items from wrapping to the next line
                            marginBottom: '40px'
                        }}
                    >
                        {topFormats.map((format) => (
                            <div
                                key={format.id}  // Use a unique identifier instead of index for key
                                onClick={() => { handleTopFormatSelect(format) }}
                                className='sessionChoiceSmall'
                                style={{
                                    display: 'inline-block',  // Ensure each item stays inline
                                    textAlign: 'center',  // Center text within each item
                                    minWidth: '180px',  // Set a minimum width for each item for better alignment
                                    whiteSpace: 'normal',  // Allow text to wrap within this div
                                }}
                            >
                                <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>💪</div>
                                <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
                                    <div>{`${format.sets} x ${format.reps}:`} </div>
                                    <select
                                        className="form-control"
                                        value={topFormatWeight}
                                        onChange={(e) => setTopFormatWeight(parseFloat(e.target.value))}
                                        style={{ width: '80px' }}
                                    >
                                        <option value="" disabled>
                                            Charge (kg)
                                        </option>
                                        {weightLoadOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option} kg
                                            </option>
                                        ))}
                                    </select>
                                    <div>{" kg"}</div>
                                </div>
                                <div style={{ fontSize: '0.66rem', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                    {format.unit}
                                </div>
                            </div>
                        ))}
                        {hasMoreFormats && (
                            <div
                                onClick={loadMoreFormats}
                                className='sessionChoiceSmall'
                                style={{
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    minWidth: '200px',
                                    cursor: 'pointer'
                                }}
                            >
                                {loadingMoreFormats ? (
                                    <MiniLoader />
                                ) : (
                                    <>
                                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>➕</div>
                                        <div>Voir plus</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            }

            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                {sets.length > 0 ? (
                    sets.map((set, index) => (
                        <div className="popInElement" key={index} style={{ marginBottom: '10px', width: '100%', maxWidth: '600px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                    <label >
                                        <div>⏱️</div>
                                        <div>Unité</div>
                                        <select className="custom-select" value={set.unit} onChange={(e) => handleUnitChange(index, e)}>
                                            <option value="repetitions">Répetitions</option>
                                            <option value="seconds">Secondes</option>
                                        </select>
                                    </label>
                                    <label >
                                        <div>🔢</div>
                                        <div>{set.unit === 'repetitions' ? 'Répétitions' : 'Secondes'}</div>
                                        <select className="form-control" value={set.value} onChange={(e) => handleValueChange(index, e)}>
                                            <option value="" disabled>
                                                Nb Reps / Secs
                                            </option>
                                            {[...Array(3600).keys()].map((i) => (
                                                <option key={i} value={i}>
                                                    {i} {set.unit === 'repetitions' ? 'Reps' : 'Secs'}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label >
                                        <div>⚖️</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                            Charge
                                            <GranularitySelector granularity={granularity} onChange={handleGranularityChange} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <select className="form-control" value={set.weightLoad} onChange={(e) => handleWeightLoadChange(index, e)}>
                                                <option value="" disabled>
                                                    Charge (kg)
                                                </option>
                                                {weightLoadOptions.map((option) => (
                                                    <option key={option} value={option}>
                                                        {option} kg
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </label>
                                    <label >
                                        <div>🪢</div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                            Élastique
                                            <span
                                                data-tooltip-id="my-tooltip"
                                                data-tooltip-html={tooltipText}
                                                data-tooltip-place="top"
                                                style={{ cursor: 'help', fontSize: '0.8rem', opacity: 0.7 }}
                                            >
                                                ℹ️
                                            </span>
                                        </div>
                                        <select className="custom-select" value={set.elastic?.use || ''} onChange={(e) => handleChangeElasticUse(index, e)}>
                                            <option value="resistance">Résistance</option>
                                            <option value="assistance">Assistance</option>
                                            <option value="">Sans</option>
                                        </select>
                                        {set.elastic?.use && (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                    Tension
                                                    <span
                                                        data-tooltip-id="my-tooltip"
                                                        data-tooltip-html={tooltipText}
                                                        data-tooltip-place="top"
                                                        style={{ cursor: 'help', fontSize: '0.8rem', opacity: 0.7 }}
                                                    >
                                                        ℹ️
                                                    </span>
                                                    <GranularitySelector granularity={granularity} onChange={handleGranularityChange} />
                                                </div>
                                                <select className="form-control" value={set.elastic?.tension || ''} onChange={(e) => handleChangeElasticTension(index, e)}>
                                                    <option value="" disabled>
                                                        Tension (kg)
                                                    </option>
                                                    {tensionOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option} kg
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                                <button onClick={() => handleCopySet(index)} className='btn btn-dark'>
                                    Recopier
                                </button>
                                <button onClick={() => handleRemoveSet(index)} className='btn btn-white'>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    ))
                ) : null}
            </div >


            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button onClick={() => setSets([...sets, { unit: "reps", value: "", weightLoad: "", elastic: null }])} className='btn btn-dark'>
                    Ajouter Série
                </button>
                <button onClick={handleNextExercice} className='btn btn-white'>
                    Valider
                </button>
            </div>

            <div>
                {alert && (
                    <Alert message={alert.message} type={alert.type} onClose={handleClose} />
                )}
            </div>
        </div >
    );
};

export default SetsChoice;
