import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { getUserById } from '../../utils/user';
import { Loader } from '../../components/Loader';
import { seanceToSets } from "../../utils/sets";
import Alert from '../../components/Alert';
import SessionPostChild from './SessionPostChild';
import API from '../../utils/API';
import { COLORS } from '../../utils/constants';

const SessionPost = ({ seanceId, selectedName, selectedDate, selectedExercices, onBack, title, description, seancePhotos }) => {
    const [postTitle, setPostTitle] = useState(title);
    const [postDescription, setPostDescription] = useState(description);
    const [recordSummary, setRecordSummary] = useState(null);
    const [randomizedColors, setRandomizedColors] = useState([]);
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
        // Initialize randomized colors once
        setRandomizedColors([...COLORS.backgroundColors].sort(() => Math.random() - 0.5));

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
        setRecordSummary(recordSummary);

        // User
        getUserById(localStorage.getItem("id")).then((response) => {
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

    const handlePostSubmit = async () => {
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

        let updatedPhotos = await API.getPhotos(localStorage.getItem('id'), selectedDate, selectedName).then((response) => {
            return response.data.images;
        });
        if (seanceId) {
            const seancePhotos = await API.getPhotosBySeanceId(seanceId).then((response) => {
                return response.data.images;
            });
            updatedPhotos = updatedPhotos.concat(seancePhotos);
        }
        console.log('Updated Photos:', updatedPhotos);

        if (seanceId) {
            // Update existing seance
            API.updateSeance({ id: seanceId, seance: seance, photoIds: updatedPhotos.map(photo => photo._id) }).then((response) => {
                const updatedSeance = response.data.updatedSeance;
                console.log('Updated Seance:', updatedSeance);

                // Delete existing sets
                API.deleteSeanceSets({ seanceId }).then(() => {
                    // Create new sets
                    const seanceSets = seanceToSets(seanceId, selectedExercices, localStorage.getItem("id"), selectedDate);
                    console.log('New Seance Sets:', seanceSets);

                    seanceSets.forEach((seanceSet) => {
                        API.createSet({ set: seanceSet }).then((response)).catch((error) => {
                            setIsSubmitting(false);
                            setAlert({ message: "Erreur lors de la mise à jour du set: " + error, type: "danger" });
                        });
                    });

                    setAlert({ message: "Séance mise à jour avec succès!", type: "success" });
                    setTimeout(() => {
                        window.location.href = `/dashboard`
                    }, 2000);
                }).catch((error) => {
                    setIsSubmitting(false);
                    setAlert({ message: "Erreur lors de la suppression des sets: " + error, type: "danger" });
                });
            }).catch((error) => {
                setIsSubmitting(false);
                setAlert({ message: "Erreur lors de la mise à jour de la séance: " + error, type: "danger" });
            });
        } else {
            // Create new seance
            API.createSeance({ seance: seance, photoIds: updatedPhotos.map(photo => photo._id) }).then((response) => {
                const createdSeance = response.data.newSeance;
                console.log('Created Seance:', createdSeance);

                const seanceSets = seanceToSets(createdSeance._id, selectedExercices, localStorage.getItem("id"), selectedDate);
                console.log('Seance Sets:', seanceSets);

                seanceSets.forEach((seanceSet) => {
                    API.createSet({ set: seanceSet }).then((response)).catch((error) => {
                        setIsSubmitting(false);
                        setAlert({ message: "Erreur lors de la création du set: " + error, type: "danger" });
                    });
                });

                setAlert({ message: "Séance créée avec succès!", type: "success" });
                setTimeout(() => {
                    window.location.href = `/dashboard`
                }, 2000);
            }).catch((error) => {
                setIsSubmitting(false);
                setAlert({ message: "Erreur lors de la création de la séance: " + error, type: "danger" });
            });
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            <h1 style={{ color: '#9b0000', position: "absolute", left: "40px", margin: "20px 0" }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <div className="session-post" style={width < 400 ? { padding: '5px', margin: "80px 0 0 0" } : width < 550 ? { padding: '10px', margin: "80px 10px 0 10px" } : { padding: '20px' }}>

                <SessionPostChild
                    seanceId={seanceId}
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
                    backgroundColors={randomizedColors}
                    editable={true}
                    seancePhotos={seancePhotos}
                    displayComments={false}
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
