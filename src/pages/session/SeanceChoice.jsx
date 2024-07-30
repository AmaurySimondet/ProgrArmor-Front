import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect'; // Ensure the path is correct
import API from '../../utils/API'; // Ensure the path is correct

const SessionChoice = ({ onNext }) => {
    const [sessions, setSessions] = useState([]);
    const [allSessions, setAllSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMore, setShowMore] = useState(true); // Track whether to show the "More Choices" button
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Fetch real session data from the API
        API.getSeanceNames({ userId: localStorage.getItem("id") }) // Replace with actual user ID or other params if needed
            .then(response => {
                const seanceNames = response.data.seanceNames;
                const initialSessions = [
                    { id: '2', name: 'Partir de zéro', icon: '✍️' },
                    { id: '1', name: 'Dernière séance en date', icon: '📅' },
                ];
                const seanceSessions = seanceNames.map((name, index) => ({
                    id: (index + 3).toString(), // Starting from id 3
                    name: `Dernière séance ${name}`,
                    icon: '🏋️'
                }));
                const combinedSessions = [...initialSessions, ...seanceSessions];
                setAllSessions(combinedSessions);
                setSessions(combinedSessions.slice(0, 3)); // Show only first 3 sessions initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching seance names:", error);
                setLoading(false);
            });
    }, []);

    const handleMoreChoices = () => {
        setSessions(allSessions); // Show all sessions
        setShowMore(false); // Hide the "More Choices" button
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
