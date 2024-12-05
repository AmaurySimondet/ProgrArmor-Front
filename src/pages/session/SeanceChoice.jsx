import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect';
import API from '../../utils/API';
import { stringToDate } from '../../utils/dates';
import { useSearchParams } from 'react-router-dom';

const SessionChoice = ({ onNext }) => {
    const [allSessions, setAllSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        // Check if seance ID is in URL params
        const seanceId = searchParams.get('id');

        // Fetch real session data from the API
        API.getSeanceNames({ userId: localStorage.getItem("id") })
            .then(response => {
                const seanceNames = response.data.seanceNames;

                // If seanceId exists in URL, find and redirect to that session
                if (seanceId) {
                    const targetSeance = seanceNames.find(seance => seance._id === seanceId);
                    if (targetSeance) {
                        onNext({
                            id: '1',
                            postTitle: targetSeance.title,
                            title: targetSeance.name,
                            name: targetSeance.name,
                            icon: '🏋️',
                            value: "params",
                            description: targetSeance.description,
                            subtitle: stringToDate(targetSeance.date),
                            date: stringToDate(targetSeance.date),
                            _id: targetSeance._id,
                        });
                        return;
                    }
                }

                const initialSessions = [{ id: '1', title: 'Partir de zéro', icon: '✍️', value: "new" }];

                // Only add 'Dernière séance en date' if there are user sessions
                if (seanceNames.length > 0) {
                    initialSessions.push({
                        id: '2',
                        title: 'Dernière séance',
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

                let combinedSessions = [...initialSessions, ...seanceSessions];
                // filter out same seance.name
                combinedSessions = combinedSessions.filter((session, index, self) =>
                    index === self.findIndex((t) => (
                        t.name === session.name
                    ))
                );
                setAllSessions(combinedSessions);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching seance names:", error);
                setLoading(false);
            });
    }, [onNext, searchParams]);

    if (loading) {
        return <Loader />;
    }

    const handleChoice = (session) => {
        onNext(session);
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h1>Choisir un modèle</h1>
            <div className="sessionChoiceContainer">
                {allSessions.map((session) => (
                    <div
                        key={session.id}
                        onClick={() => handleChoice(session)}
                        className='sessionChoice'
                    >
                        <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>{session.icon}</div>
                        <div>{session.title}</div>
                        <div style={{ fontSize: '0.66rem' }}>{session.subtitle}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionChoice;
