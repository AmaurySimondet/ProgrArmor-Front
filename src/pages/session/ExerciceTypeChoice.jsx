import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import apiCalls from '../../utils/apiCalls';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import { useWindowDimensions } from '../../utils/useEffect';
import Fuse from 'fuse.js';
import RenderExercice from './RenderExercice';

const ExerciceTypeChoice = ({ onNext, onBack, onSearch, index, exercice, onFavorite }) => {
    const [combinations, setCombinations] = useState(null);
    const [exerciceTypes, setExerciceTypes] = useState(null);
    const [allExerciceTypes, setAllExerciceTypes] = useState(null);
    const [allCombinations, setAllCombinations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true); // Track whether to show more types
    const [emojis, setEmojis] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Track the search input
    const { width } = useWindowDimensions();
    const [favoriteExercices, setFavoriteExercices] = useState(null);

    useEffect(() => {
        // Fetch exercise types from the API
        setLoading(true);

        // Fetch all data (exercise types, combinations, favorite exercices)
        const fetchAllData = async () => {
            try {
                // Fetch and process exercise types
                const response = await API.getExerciceTypes();
                const fetchedTypes = response.data.exerciceTypes || [];

                // Fetch exercises for each type
                const typesWithExercises = await Promise.all(
                    fetchedTypes.map(async type => {
                        try {
                            const exercisesResponse = await API.getExercices({ exerciceType: type._id });
                            return {
                                ...type,
                                exercises: exercisesResponse.data.exercices.sort((a, b) => a.name.fr.localeCompare(b.name.fr)) || []
                            };
                        } catch (error) {
                            console.error(`Error fetching exercises for type ${type.name.fr}:`, error);
                            return {
                                ...type,
                                exercises: []
                            };
                        }
                    })
                );

                setAllExerciceTypes(typesWithExercises);
                setExerciceTypes(typesWithExercises.slice(0, 7));

                // Fetch combinations
                const combinationsResponse = await API.getCombinations();
                setAllCombinations(combinationsResponse.data.combinations);

                // Fetch favorite exercises
                const favoriteExercices = await apiCalls.fetchFavoriteExercices(localStorage.getItem('id'));
                setFavoriteExercices(favoriteExercices);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        if (allExerciceTypes) {
            setEmojis(randomBodybuildingEmojis(allExerciceTypes.length));
        }
    }, [allExerciceTypes]);

    const handleMoreTypes = () => {
        setExerciceTypes(allExerciceTypes); // Show all exercise types
        setMoreTypesUnclicked(false); // Hide the "More Types" button
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === '') {
            setCombinations(allCombinations.slice(0, 7));
            return;
        }
        const fuse = new Fuse(allCombinations, { keys: ['combinationName.fr'] });
        const results = fuse.search(event.target.value);
        setCombinations(results.map(result => result.item));
    };



    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>

            <h1>{index !== null ? "Modifier" : "Choisir"} un exercice</h1>

            <RenderExercice exercice={exercice} />

            {/* Favorite Exercices */}
            {favoriteExercices && favoriteExercices.length > 0 &&
                <div>
                    <h3 style={{ color: '#9b0000' }}>Exercices favoris</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            maxWidth: '95vw',
                            margin: '0 auto',
                            maxHeight: '250px',
                            overflowX: 'auto',  // Enable horizontal scrolling
                            whiteSpace: 'nowrap',  // Prevent items from wrapping to the next line
                        }}
                    >
                        {favoriteExercices.map((favorite) => (
                            <div
                                key={favorite.id}  // Use a unique identifier instead of index for key
                                onClick={() => onFavorite(favorite.exercice, favorite.categories)}
                                className='sessionChoiceSmall'
                                style={{
                                    display: 'inline-block',  // Ensure each item stays inline
                                    textAlign: 'center',  // Center text within each item
                                    minWidth: '200px',  // Set a minimum width for each item for better alignment
                                    whiteSpace: 'normal',  // Allow text to wrap within this div
                                }}
                            >
                                <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>🌟</div>
                                <div>{favorite.exercice.name.fr}</div>
                                <div style={{ fontSize: '0.66rem', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                    {favorite.categories.map(category => category.category.name.fr).join(', ')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            }



            {/* Search Bar */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Rechercher un exercice..."
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
                    {combinations.length ? (
                        combinations.map((combination, index) => (
                            <div
                                key={index}
                                onClick={() => onSearch(combination)}
                                className="inputClickable"
                            >
                                {combination.combinationName.fr}
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: '#999' }}>Aucun résultat trouvé</div>
                    )}
                </div>
            )}

            <div className="sessionChoiceContainer">
                {exerciceTypes?.map((type, index) => (
                    <div
                        key={index}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis?.[index]}</div>
                        <div>{type.name.fr}</div>
                        <select
                            className="form-control"
                            onChange={(e) => {
                                const selectedExercise = type.exercises.find(ex => ex._id === e.target.value);
                                onNext(selectedExercise);
                            }}
                            style={{ fontSize: '0.8rem', marginTop: '5px' }}
                        >
                            <option value="">Sélectionner un exercice</option>
                            {type.exercises?.map((exercise, i) => (
                                <option key={i} value={exercise._id}>
                                    {exercise.name.fr}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                {moreTypesUnclicked && (
                    <div
                        onClick={handleMoreTypes}
                        className='sessionChoicePlus'
                    >
                        <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default ExerciceTypeChoice;
