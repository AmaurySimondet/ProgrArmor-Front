import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API'; // Ensure the API module is correctly imported
import { randomBodybuildingEmojis } from '../../utils/emojis';

const ExerciceChoice = ({ selectedType, onNext, onBack }) => {
    const [exercices, setExercices] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [allExercices, setAllExercices] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreExercicesUnclicked, setMoreExercicesUnclicked] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // First get exericeType id from name
        API.getExericeTypeId({ name: selectedType }) // Replace with the actual method to fetch exercices
            .then(response => {
                console.log(response.data.exerciceTypeId);
                setSelectedTypeId(response.data.exerciceTypeId);
            }
            )
            .catch(error => {
                console.error("Error fetching exercices:", error);
                setLoading(false);
            }
            );
    }, [selectedType]);


    useEffect(() => {
        API.getExercices({ exerciceType: selectedTypeId }) // Replace with the actual method to fetch exercices
            .then(response => {
                console.log(response.data.exercices);
                let fetchedExercices = response.data.exercices || [];
                // keep only name.fr
                fetchedExercices = fetchedExercices.map(exercice => exercice.name.fr);
                setAllExercices(fetchedExercices);
                setExercices(fetchedExercices.slice(0, 3)); // Show only the first 3 exercices initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exercices:", error);
                setLoading(false);
            });
    }, [selectedTypeId]);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allExercices.length));
    }, [allExercices]);

    const handleMoreExercices = () => {
        setExercices(allExercices); // Show all exercices
        setMoreExercicesUnclicked(false); // Hide the "More Exercices" button
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
            <h1>Choisir un exercice ({selectedType})</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {exercices.map((exercice, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(exercice)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{emojis[index]}</div>
                        <div>{exercice}</div>
                    </div>
                ))}
                {moreExercicesUnclicked && allExercices.length > 3 && (
                    <div
                        onClick={handleMoreExercices}
                        className='sessionChoicePlus'
                        style={{ cursor: 'pointer', color: '#007bff' }}
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciceChoice;
