import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import { useWindowDimensions } from '../../utils/useEffect';
import Fuse from 'fuse.js';

const ExerciceTypeChoice = ({ onNext, onDelete, onBack, onSearch }) => {
    const [exerciceTypes, setExerciceTypes] = useState([]);
    const [allExerciceTypes, setAllExerciceTypes] = useState([]);
    const [allExercices, setAllExercices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true); // Track whether to show more types
    const [emojis, setEmojis] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Track the search input
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Fetch exercise types from the API
        API.getExerciceTypes() // Replace with the actual method to fetch exercise types
            .then(response => {
                const fetchedTypes = response.data.exerciceTypes || [];
                setAllExerciceTypes(fetchedTypes);
                setExerciceTypes(fetchedTypes.slice(0, 3)); // Show only the first 3 types initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching exercise types:", error);
                setLoading(false);
            });

        // Fetch all exercise names from the API for the search feature
        API.getExercices() // Replace with the actual method to fetch exercise names
            .then(response => {
                const fetchedNames = response.data.exercices || [];
                const uniqueNames = fetchedNames.map(exercice => exercice.name.fr).filter((value, index, self) => self.indexOf(value) === index);
                setAllExercices(uniqueNames);
            })
            .catch(error => {
                console.error("Error fetching exercise names:", error);
            });
    }, []);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allExerciceTypes.length));
    }, [allExerciceTypes]);

    const handleMoreTypes = () => {
        setExerciceTypes(allExerciceTypes); // Show all exercise types
        setMoreTypesUnclicked(false); // Hide the "More Types" button
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const options = {
        includeScore: true, // Include match scores
        threshold: 0.7, // Adjust this for more or fewer matches (0 is an exact match, 1 matches everything)
        keys: ['name'], // The key(s) you want to search within
    };

    const fuse = new Fuse(allExercices.map(ex => ({ name: ex })), options);
    const filteredExercices = fuse.search(searchQuery).map(result => result.item.name);


    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1>Choisir le type d'exercice</h1>

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

            {/* Search Results */}
            {searchQuery && (
                <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredExercices.length ? (
                        filteredExercices.map((exercice, index) => (
                            <div
                                key={index}
                                onClick={() => onSearch(exercice)}
                                style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #ccc' }}
                            >
                                {exercice}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#999' }}>Aucun résultat trouvé</div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {exerciceTypes.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(type.name.fr)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>{emojis[index]}</div>
                        <div>{type.name.fr}</div>
                        <div style={{ fontSize: '0.66rem' }}>{type.examples.fr.join(', ')}</div>
                    </div>
                ))}
                {moreTypesUnclicked && (
                    <div
                        onClick={handleMoreTypes}
                        className='sessionChoicePlus'
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
            <button onClick={onDelete} className='btn btn-black mt-5'>
                Supprimer l'exercice
            </button>
        </div>
    );
};

export default ExerciceTypeChoice;
