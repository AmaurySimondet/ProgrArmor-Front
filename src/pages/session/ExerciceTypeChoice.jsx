import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import { useWindowDimensions } from '../../utils/useEffect';
import Fuse from 'fuse.js';
import RenderExercice from './RenderExercice';

const ExerciceTypeChoice = ({ onNext, onBack, onSearch, index, exercice, onFavorite }) => {
    const [exercices, setExercices] = useState(null);
    const [exerciceTypes, setExerciceTypes] = useState(null);
    const [allExerciceTypes, setAllExerciceTypes] = useState(null);
    const [allExercices, setAllExercices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true); // Track whether to show more types
    const [emojis, setEmojis] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Track the search input
    const { width } = useWindowDimensions();
    const [favoriteExercices, setFavoriteExercices] = useState(null);

    useEffect(() => {
        // Fetch exercise types from the API
        API.getExerciceTypes() // Replace with the actual method to fetch exercise types
            .then(response => {
                const fetchedTypes = response.data.exerciceTypes || [];
                setAllExerciceTypes(fetchedTypes);
                setExerciceTypes(fetchedTypes.slice(0, 3)); // Show only the first 3 types initially
            })
            .catch(error => {
                console.error("Error fetching exercise types:", error);
            });

        // Fetch all exercise names from the API for the search feature
        API.getExercices() // Replace with the actual method to fetch exercise names
            .then(response => {
                const fetchedNames = response.data.exercices || [];
                setAllExercices(fetchedNames);
            })
            .catch(error => {
                console.error("Error fetching exercise names:", error);
            });

        API.getTopExercices({ userId: localStorage.getItem('id') })
            .then(response => {
                let favoriteExercices = response.data.topExercices;

                // Use Promise.all to fetch all the needed information in parallel
                const fetchDetailsPromises = favoriteExercices.map(async exercice => {
                    // Fetch exercise details
                    const exerciceDetails = await API.getExercice({ id: exercice.exercice, fields: ["name", "_id"] });

                    // Fetch category details for each category in the categories array
                    let categories = [];
                    if (exercice.categories && exercice.categories.length > 0) {
                        const categoryDetailsPromises = exercice.categories.map(async (categoryObj) => {
                            const categoryDetails = await API.getCategory({ id: categoryObj.category, fields: ["name", "_id"] });
                            return {
                                ...categoryObj,
                                category: categoryDetails.data.categoryReturned
                            };
                        });

                        // Wait for all category details to be fetched
                        categories = await Promise.all(categoryDetailsPromises);
                    }

                    // Return the exercise object with the added details
                    return {
                        ...exercice,
                        exercice: exerciceDetails.data.exerciceReturned,
                        categories: categories // Replace categories with full details
                    };
                });

                // Wait for all exercises to be processed
                Promise.all(fetchDetailsPromises)
                    .then(completedExercices => {
                        favoriteExercices = completedExercices;
                        setFavoriteExercices(favoriteExercices);
                    })
                    .catch(error => {
                        console.error("Error completing favorite exercices:", error);
                    });
            })
            .catch(error => {
                console.error("Error fetching favorite exercices:", error);
            });
    }, []);

    //when everything is loaded, set loading to false
    useEffect(() => {
        if (allExerciceTypes && allExercices && favoriteExercices) {
            setLoading(false);
        }
    }, [allExerciceTypes, allExercices, favoriteExercices]);

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
            setExercices(allExercices.slice(0, 3));
            setMoreExercicesUnclicked(true);
            return;
        }
        const fuse = new Fuse(allExercices, { keys: ['name.fr'] });
        const results = fuse.search(event.target.value);
        setExercices(results.map(result => result.item));
    };



    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h2
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>

            <h1 style={{ margin: 0 }}
            >{index !== null ? "Modifier" : "Choisir"} un exercice</h1>

            <RenderExercice exercice={exercice} />

            {/* Favorite Exercices */}
            {favoriteExercices.length > 0 &&
                <div>
                    <h3 style={{ color: '#9b0000' }}>Exercices favoris</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'flex-start',  // Align items to the start of the scrollable area
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
                                <div style={{ fontSize: width < 500 ? '20px' : '40px' }}>🌟</div>
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
                    {exercices.length ? (
                        exercices.map((exercice, index) => (
                            <div
                                key={index}
                                onClick={() => onSearch(exercice)}
                                className="inputClickable"
                            >
                                {exercice.name.fr}
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
        </div >
    );
};

export default ExerciceTypeChoice;
