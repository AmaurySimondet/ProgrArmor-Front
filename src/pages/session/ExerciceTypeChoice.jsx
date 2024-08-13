import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import { useWindowDimensions } from '../../utils/useEffect';

const ExerciceTypeChoice = ({ onNext, onDelete, onBack }) => {
    const [exerciceTypes, setExerciceTypes] = useState([]);
    const [allExerciceTypes, setAllExerciceTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true); // Track whether to show more types
    const [emojis, setEmojis] = useState([]);
    const { width } = useWindowDimensions();


    useEffect(() => {
        // Fetch exercice types from the API
        API.getExerciceTypes() // Replace with the actual method to fetch exercice types
            .then(response => {
                console.log(response.data.exerciceTypes);
                const fetchedTypes = response.data.exerciceTypes || [];
                setAllExerciceTypes(fetchedTypes);
                setExerciceTypes(fetchedTypes.slice(0, 3)); // Show only the first 3 types initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exercice types:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allExerciceTypes.length));
    }, [allExerciceTypes]);

    const handleMoreTypes = () => {
        setExerciceTypes(allExerciceTypes); // Show all exercice types
        setMoreTypesUnclicked(false); // Hide the "More Types" button
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1>Choisir le type d'exercice</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {exerciceTypes.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(type.name.fr)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{emojis[index]}</div>
                        <div>{type.name.fr}</div>
                        <div style={{ fontSize: '0.66rem' }}>{type.examples.fr.join(', ')}</div>
                    </div>
                ))}
                {moreTypesUnclicked && (
                    <div
                        onClick={handleMoreTypes}
                        className='sessionChoicePlus'
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
            <button onClick={onDelete} className='btn btn-black mt-5'>
                Supprimer l'exercice
            </button>
        </div>
    );
};

export default ExerciceTypeChoice;
