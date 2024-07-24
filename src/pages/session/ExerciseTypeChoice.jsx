import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import { randomBodybuildingEmoji } from '../../utils/emojis';

const ExerciseTypeChoice = ({ onNext, onBack, onDelete }) => {
    const [exerciseTypes, setExerciseTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simulate fetching exercise types from an API
        setTimeout(() => {
            setExerciseTypes([{ name: 'Type A', id: 1, examples: ['Example 1', 'Example 2'] }, { name: 'Type B', id: 2, examples: ['Example 3', 'Example 4'] }, { name: 'Type C', id: 3, examples: ['Example 5', 'Example 6'] }]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMoreTypes = () => {
        setExerciseTypes([...exerciseTypes, { name: 'Type D', id: 4, examples: ['Example 7', 'Example 8'] }, { name: 'Type E', id: 5, examples: ['Example 9', 'Example 10'] }, { name: 'Type F', id: 6, examples: ['Example 11', 'Example 12'] }]);
        setMoreTypesUnclicked(false);
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
                {exerciseTypes.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(type.name)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{randomBodybuildingEmoji()}</div>
                        <div>{type.name}</div>
                        <div style={{ fontSize: '0.66rem' }}>{type.examples.join(', ')}</div>
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

export default ExerciseTypeChoice;
