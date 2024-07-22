import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';

const SessionNameChoice = ({ onNext, onBack }) => {
    const [names, setNames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customName, setCustomName] = useState('');

    useEffect(() => {
        // Simuler la récupération des noms de séances depuis une API
        setTimeout(() => {
            setNames(['Séance A', 'Séance B', 'Séance C', 'Séance D']);
            setLoading(false);
        }, 1000);
    }, []);

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
        <div>
            <h2>Choisir le nom de la séance</h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {names.map((name, index) => (
                    <div
                        key={index}
                        onClick={() => handleChoice(name)}
                        style={{
                            cursor: 'pointer',
                            padding: '20px',
                            borderRadius: '10px',
                            border: '1px solid #ccc',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '24px' }}>🏋️</div>
                        <div>{name}</div>
                    </div>
                ))}
                <div
                    style={{
                        padding: '20px',
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                        textAlign: 'center',
                        flex: '1 1 200px'
                    }}
                >
                    <input
                        type="text"
                        value={customName}
                        onChange={handleCustomNameChange}
                        placeholder="Entrer un nom"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <button onClick={handleCustomNameSubmit}>Valider</button>
                </div>
            </div>
            <button onClick={onBack} style={{ marginTop: '20px' }}>
                Retour
            </button>
        </div>
    );
};

export default SessionNameChoice;
