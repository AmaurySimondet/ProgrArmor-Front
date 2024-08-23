import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect';
import API from '../../utils/API';
import { stringToDate } from '../../utils/dates';

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

                const initialSessions = [{ id: '1', title: 'Partir de zéro', icon: '✍️', value: "new" }];

                // Only add 'Dernière séance en date' if there are user sessions
                if (seanceNames.length > 0) {
                    initialSessions.push({
                        id: '2',
                        title: 'Dernière séance en date',
                        name: seanceNames[0].name,
                        icon: '📅',
                        value: "last",
                        subtitle: seanceNames[0].name + " le " + stringToDate(seanceNames[0].date),
                        date: stringToDate(seanceNames[0].date),
                        _id: seanceNames[0]._id
                    })
                }

                // Create a set to track names that have been added
                const existingNames = new Set();

                // Filter out duplicates while mapping
                const seanceSessions = seanceNames
                    .filter(seance => {
                        if (existingNames.has(seance.name)) {
                            // If name already exists, filter it out
                            return false;
                        } else {
                            // Otherwise, add the name to the set and include it in the result
                            existingNames.add(seance.name);
                            return true;
                        }
                    })
                    .map((seance, index) => ({
                        id: (index + 3).toString(), // Starting from id 3
                        title: `Dernière séance ${seance.name}`,
                        name: seance.name,
                        icon: '🏋️',
                        value: seance.name,
                        subtitle: stringToDate(seance.date),
                        date: stringToDate(seance.date),
                        _id: seance._id,
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
            <h1>Choisir un modèle</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => handleChoice(session)}
                        className='sessionChoice'
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>{session.icon}</div>
                        <div>{session.title}</div>
                        <div style={{ fontSize: '0.66rem' }}>{session.subtitle}</div>
                    </div>
                ))}
                {showMore && allSessions.length > 1 && (
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
