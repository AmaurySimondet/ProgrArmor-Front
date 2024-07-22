import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect'; // Ensure the path is correct

const SessionChoice = ({ onNext }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(true); // Track whether to show the "More Choices" button
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simulate fetching initial session data
        setTimeout(() => {
            setSessions([
                { id: '2', name: 'Partir de zéro', icon: '✍️' },
                { id: '1', name: 'Dernière séance en date', icon: '📅' },
                { id: '3', name: 'Dernière séance {Nom1}', icon: '🏋️' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMoreChoices = () => {
        setLoading(true);
        // Simulate fetching additional session data
        setTimeout(() => {
            setSessions(prevSessions => [
                ...prevSessions,
                { id: '4', name: 'Nouvelle séance A', icon: '📚' },
                { id: '5', name: 'Nouvelle séance B', icon: '🏆' },
                { id: '6', name: 'Nouvelle séance C', icon: '🔥' },
                { id: '7', name: 'Nouvelle séance D', icon: '🎯' },
            ]);
            setLoading(false);
            setShowMore(false); // Hide the "More Choices" button
        }, 1000);
    };

    if (loading) {
        return <Loader />;
    }

    const handleChoice = (session) => {
        onNext(session);
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
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

export default SessionChoice;
