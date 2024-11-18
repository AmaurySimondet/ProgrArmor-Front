import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API'; // Ensure the API module is correctly imported
import { randomBodybuildingEmojis } from '../../utils/emojis';
import Fuse from 'fuse.js';
import RenderExercice from './RenderExercice';

const ExerciceChoice = ({ selectedType, onNext, onBack, index, exercice }) => {
    const [exercices, setExercices] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [allExercices, setAllExercices] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreExercicesUnclicked, setMoreExercicesUnclicked] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        // if selectedType is null, go back
        if (!selectedType) {
            onBack();
        }

        // First get exericeType id from name
        API.getExerciceType({ name: selectedType }) // Replace with the actual method to fetch exercices
            .then(response => {
                setSelectedTypeId(response.data.exerciceTypeReturned._id);
            }
            )
            .catch(error => {
                console.error("Error fetching exercices:", error);
                setLoading(false);
            }
            );
    }, [selectedType]);


    useEffect(() => {
        if (selectedTypeId) {
            API.getExercices({ exerciceType: selectedTypeId }) // Replace with the actual method to fetch exercices
                .then(response => {
                    let fetchedExercices = response.data.exercices || [];
                    setAllExercices(fetchedExercices);
                    setExercices(fetchedExercices.slice(0, 3)); // Show only the first 3 exercices initially
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching exercices:", error);
                    setLoading(false);
                });
        }
    }, [selectedTypeId]);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allExercices.length));
    }, [allExercices]);

    const handleMoreExercices = () => {
        setExercices(allExercices); // Show all exercices
        setMoreExercicesUnclicked(false); // Hide the "More Exercices" button
    };

    if (loading) {
        return <Loader />;
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === '') {
            setExercices(allExercices.slice(0, 3));
            setMoreExercicesUnclicked(true);
            return;
        }
        setMoreExercicesUnclicked(false);
        const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
        const results = fuse.search(event.target.value);
        setExercices(results.map(result => result.item));
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1>{index !== null ? "Modifier" : "Choisir"} un exercice ({selectedType})</h1>

            <RenderExercice exercice={exercice} />

            {/* Search Bar */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Ou rechercher un exercice..."
                style={{
                    padding: '10px',
                    fontSize: '1rem',
                    margin: '20px 0',
                    width: '80%',
                    maxWidth: '400px',
                    borderRadius: '5px',
                }}
            />

            <div className="sessionChoiceContainer">
                {exercices.map((exercice, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(exercice)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis[index]}</div>
                        <div>{exercice.name.fr}</div>
                    </div>
                ))}
                {moreExercicesUnclicked && allExercices.length > 3 && (
                    <div
                        onClick={handleMoreExercices}
                        className='sessionChoicePlus'
                        style={{ cursor: 'pointer', color: '#007bff' }}
                    >
                        <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExerciceChoice;
