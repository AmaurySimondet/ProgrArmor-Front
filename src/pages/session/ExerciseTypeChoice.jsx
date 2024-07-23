import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import { randomBodybuildingEmoji } from '../../utils/emojis';

const ExerciseTypeChoice = ({ onNext, onBack, onFinish }) => {
    const [exerciseTypes, setExerciseTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simulate fetching exercise types from an API
        setTimeout(() => {
            setExerciseTypes(['Type A', 'Type B', 'Type C']);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMoreTypes = () => {
        setExerciseTypes([...exerciseTypes, 'Type D', 'Type E', 'Type F']);
    };

    const handleFinish = () => {
        onFinish();
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
            <h1>Choisir le type d'exercice</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {exerciseTypes.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(type)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{randomBodybuildingEmoji()}</div>
                        <div>{type}</div>
                    </div>
                ))}
                <div
                    onClick={handleMoreTypes}
                    className='sessionChoicePlus'
                >
                    <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                </div>
            </div>
            <button onClick={handleFinish} className='btn btn-black mt-5'>
                Séance terminée
            </button>
        </div>
    );
};

export default ExerciseTypeChoice;
