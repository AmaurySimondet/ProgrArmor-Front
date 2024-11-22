import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { getUserById } from '../../utils/user';
import Loader from '../../components/Loader';
import { seanceToSets } from "../../utils/sets";
import Alert from '../../components/Alert';
import SessionPostChild from './SessionPostChild';
import API from '../../utils/API';

const SessionPost = ({ selectedName, selectedDate, selectedExercices, onBack }) => {
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [recordSummary, setRecordSummary] = useState(null);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [alert, setAlert] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    useEffect(() => {
        // Record Summary
        // count number of unique set.PR (ex. set.PR === "PR" 3 times then recordSummary.push({ PR: "PR", number: 3 }))
        let recordSummary = [];
        const recordMap = new Map();
        selectedExercices.forEach((exercice) => {
            // Generate a unique key for this exercise and category combination
            const exerciseKey = `${exercice.exercice._id}-${exercice.categories.map(cat => cat._id).sort().join(',')}`;

            exercice.sets.forEach((set) => {
                if (set.PR) {
                    // Create a key for the PR including the exercise key
                    const recordKey = `${exerciseKey}-${set.PR}`;

                    if (!recordMap.has(recordKey)) {
                        recordMap.set(recordKey, true); // Mark this PR as processed
                        const recordIndex = recordSummary.findIndex((record) => record.PR === set.PR && record.exerciseKey === exerciseKey);

                        if (recordIndex !== -1) {
                            recordSummary[recordIndex].number++;
                        } else {
                            recordSummary.push({ PR: set.PR, number: 1, exerciseKey });
                        }
                    }
                }
            });
        });
        // aggregate same PR ({PR:SB, number: 1}, {PR:SB, number: 1} => {PR:SB, number: 2})
        new Set(recordSummary.map(record => record.PR)).forEach((pr) => {
            const prRecords = recordSummary.filter(record => record.PR === pr);
            if (prRecords.length > 1) {
                const number = prRecords.reduce((acc, record) => acc + record.number, 0);
                recordSummary = recordSummary.filter(record => record.PR !== pr);
                recordSummary.push({ PR: pr, number });
            }
        });
        console.log('Record Summary:', recordSummary);
        setRecordSummary(recordSummary);

        // User
        getUserById(localStorage.getItem("id")).then((response) => {
            console.log('User:', response);
            setUser(response);
        });

        // Stats
        const nSets = selectedExercices.reduce((acc, exercice) => acc + exercice.sets.length, 0);
        const nReps = selectedExercices.reduce((acc, exercice) => acc + exercice.sets.reduce((acc, set) => acc + set.value, 0), 0);
        const intervalReps = `${selectedExercices.reduce((acc, exercice) => Math.min(acc, ...exercice.sets.map(set => set.value)), Infinity)}-${selectedExercices.reduce((acc, exercice) => Math.max(acc, ...exercice.sets.map(set => set.value)), -Infinity)}`;
        const totalWeight = selectedExercices.reduce((acc, exercice) => acc + exercice.sets.reduce((acc, set) => acc + set.weightLoad, 0), 0);
        const intervalWeight = `${selectedExercices.reduce((acc, exercice) => Math.min(acc, ...exercice.sets.map(set => set.weightLoad)), Infinity)}-${selectedExercices.reduce((acc, exercice) => Math.max(acc, ...exercice.sets.map(set => set.weightLoad)), -Infinity)}`;
        const stats = { nSets, nReps, intervalReps, totalWeight, intervalWeight };
        setStats(stats);

        setLoading(false);
    }, [selectedExercices]);

    const handlePostSubmit = () => {
        if (!postTitle) {
            showAlert("Veuillez ajouter un titre à votre séance.", "danger");
            return;
        }

        setIsSubmitting(true); // Disable button when submission starts

        const seance = {
            title: postTitle,
            description: postDescription,
            name: selectedName,
            date: new Date(selectedDate),
            user: localStorage.getItem("id"),
            stats: stats,
            recordSummary: recordSummary,
        };

        API.createSeance({ seance: seance }).then((response) => {
            const createdSeance = response.data.newSeance;
            console.log('Created Seance:', createdSeance);
            console.log('Created Seance id:', createdSeance._id, selectedExercices, localStorage.getItem("id"));

            // for each set in selectedExercices, create a seanceSet
            const seanceSets = seanceToSets(createdSeance._id, selectedExercices, localStorage.getItem("id"), selectedDate);
            console.log('Seance Sets:', seanceSets);
            seanceSets.forEach((seanceSet) => {
                API.createSet({ set: seanceSet }).then((response)).catch((error) => {
                    setIsSubmitting(false); // Re-enable button if there's an error
                    setAlert({ message: "Erreur lors de la création du set: " + error, type: "danger" });
                });
            });

            // when all seanceSets are created, redirect to the dashboard
            setAlert({ message: "Séance créée avec succès!", type: "success" });
            // setTimeout(() => {
            //     window.location.href = `/dashboard`
            // }, 2000);
        }).catch((error) => {
            setIsSubmitting(false); // Re-enable button if there's an error
            setAlert({ message: "Erreur lors de la création de la séance: " + error, type: "danger" });
        });
    };

    if (loading) {
        return <Loader />;
    }

    const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            <h1 style={{ color: '#9b0000', position: "absolute", left: "40px", margin: "20px 0" }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <div className="session-post" style={width < 400 ? { padding: '5px', margin: "80px 0 0 0" } : width < 550 ? { padding: '10px', margin: "80px 10px 0 10px" } : { padding: '20px' }}>

                <SessionPostChild
                    id={null}
                    user={user}
                    postTitle={postTitle}
                    setPostTitle={setPostTitle}
                    postDescription={postDescription}
                    setPostDescription={setPostDescription}
                    selectedName={selectedName}
                    selectedExercices={selectedExercices}
                    recordSummary={recordSummary}
                    selectedDate={selectedDate}
                    stats={stats}
                    backgroundColors={backgroundColors}
                    editable={true}
                />

                {/* Updated Submit Button */}
                <button
                    onClick={handlePostSubmit}
                    className="btn btn-black mt-2"
                    style={{ width: '100%' }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Publication en cours...' : 'Publier la séance'}
                </button>
            </div>

            <div>
                {alert && (
                    <Alert message={alert.message} type={alert.type} onClose={handleClose} />
                )}
            </div>
        </div >

    );
}

export default SessionPost;
