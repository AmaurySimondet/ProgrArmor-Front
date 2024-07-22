import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import { randomBodybuildingEmoji } from '../../utils/emojis';

const ExerciseChoice = ({ selectedType, onNext, onBack }) => {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simulate fetching exercises from an API based on the selected type
        setTimeout(() => {
            setExercises(['Exercice A', 'Exercice B', 'Exercice C']);
            setLoading(false);
        }, 1000);
    }, [selectedType]);

    const handleMoreExercises = () => {
        setExercises([...exercises, 'Exercice D', 'Exercice E', 'Exercice F']);
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                &lt; Retour
            </h2>
            <h1>Choisir un exercice ({selectedType})</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {exercises.map((exercise, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(exercise)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{randomBodybuildingEmoji()}</div>
                        <div>{exercise}</div>
                    </div>
                ))}
                <div
                    onClick={handleMoreExercises}
                    className='sessionChoicePlus'
                >
                    <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                </div>
            </div>
        </div>
    );
};

export default ExerciseChoice;
