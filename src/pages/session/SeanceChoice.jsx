import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect';

const SessionChoice = ({ onNext, onMoreChoices }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { height, width } = useWindowDimensions();


    useEffect(() => {
        // Simuler la récupération des données des séances depuis une API
        setTimeout(() => {
            setSessions([
                { id: '2', name: 'Partir de zéro', icon: '✍️' },
                { id: '1', name: 'Dernière séance en date', icon: '📅' },
                { id: '3', name: 'Dernière séance {Nom1}', icon: '🏋️' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) {
        return <Loader />;
    }

    const handleChoice = (session) => {
        onNext(session);
    };

    return (
        // make it full width full page centered
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h1>Choisir une séance</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => handleChoice(session)}
                        className='sessionChoice'
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>{session.icon}</div>
                        <div>{session.name}</div>
                    </div>
                ))}
                <div
                    onClick={onMoreChoices}
                    //round
                    className='sessionChoicePlus'
                >
                    <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                </div>
            </div>
        </div>
    );
};

export default SessionChoice;
