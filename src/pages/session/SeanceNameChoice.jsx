import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect'; // Ensure the path is correct
import { randomBodybuildingEmoji } from '../../utils/emojis';

const SessionNameChoice = ({ onNext, onBack }) => {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customName, setCustomName] = useState('');
    const [showMore, setShowMore] = useState(true); // Track whether to show the "More Choices" button
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simuler la récupération des noms de séances depuis une API
        setTimeout(() => {
            setNames(['Séance A', 'Séance B']);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMoreChoices = () => {
        setLoading(true);
        // Simulate fetching additional session names
        setTimeout(() => {
            setNames(prevNames => [
                ...prevNames,
                'Séance C',
                'Séance D',
                'Séance E',
                'Séance F',
            ]);
            setLoading(false);
            setShowMore(false); // Hide the "More Choices" button after loading
        }, 1000);
    };

    if (loading) {
        return <Loader />;
    }

    const handleChoice = (name) => {
        onNext(name);
    };

    const handleCustomNameChange = (e) => {
        setCustomName(e.target.value);
    };

    const handleCustomNameSubmit = () => {
        if (customName.trim()) {
            onNext(customName);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <h2
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                &lt; Retour
            </h2>
            <h1 style={{ textAlign: 'center' }}>Choisir le nom de la séance</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {names.map((name, index) => (
                    <div
                        key={index}
                        onClick={() => handleChoice(name)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{randomBodybuildingEmoji()}</div>
                        <div>{name}</div>
                    </div>
                ))}
                <div
                    className='sessionChoice'
                    style={{ backgroundColor: '#CCCCCC', width: "300px" }}
                >
                    <input
                        type="text"
                        value={customName}
                        onChange={handleCustomNameChange}
                        placeholder="Entrer un nom"
                        style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button
                        onClick={handleCustomNameSubmit}
                        className='btn btn-white'
                    >
                        Valider
                    </button>
                </div>
                {showMore && (
                    <div
                        onClick={handleMoreChoices}
                        className='sessionChoicePlus'
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionNameChoice;
