import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API'; // Ensure the API module is correctly imported
import { randomBodybuildingEmojis } from '../../utils/emojis';

const ExerciseChoice = ({ selectedType, onNext, onBack }) => {
    const [exercises, setExercises] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [allExercises, setAllExercises] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreExercisesUnclicked, setMoreExercisesUnclicked] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // First get exericeType id from name
        API.getExericeTypeId({ name: selectedType }) // Replace with the actual method to fetch exercises
            .then(response => {
                console.log(response.data.exerciceTypeId);
                setSelectedTypeId(response.data.exerciceTypeId);
            }
            )
            .catch(error => {
                console.error("Error fetching exercises:", error);
                setLoading(false);
            }
            );
    }, [selectedType]);


    useEffect(() => {
        API.getExercises({ exerciceType: selectedTypeId }) // Replace with the actual method to fetch exercises
            .then(response => {
                console.log(response.data.exercices);
                let fetchedExercises = response.data.exercices || [];
                // keep only name.fr
                fetchedExercises = fetchedExercises.map(exercise => exercise.name.fr);
                setAllExercises(fetchedExercises);
                setExercises(fetchedExercises.slice(0, 3)); // Show only the first 3 exercises initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exercises:", error);
                setLoading(false);
            });
    }, [selectedTypeId]);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allExercises.length));
    }, [allExercises]);

    const handleMoreExercises = () => {
        setExercises(allExercises); // Show all exercises
        setMoreExercisesUnclicked(false); // Hide the "More Exercises" button
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
                {exercises.map((exercise, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(exercise)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{emojis[index]}</div>
                        <div>{exercise}</div>
                    </div>
                ))}
                {moreExercisesUnclicked && allExercises.length > 3 && (
                    <div
                        onClick={handleMoreExercises}
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

export default ExerciseChoice;
