import React, { useState, useEffect } from 'react';
import { Loader, MiniLoader } from '../../components/Loader';
import API from '../../utils/API';
import apiCalls from '../../utils/apiCalls';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import { useWindowDimensions } from '../../utils/useEffect';
import Fuse from 'fuse.js';
import RenderExercice from './RenderExercice';

const ExerciceTypeChoice = ({ onNext, onBack, onSearch, index, exercice, onFavorite }) => {
    const [exerciceTypes, setExerciceTypes] = useState(null);
    const [allExerciceTypes, setAllExerciceTypes] = useState(null);
    const [allCombinations, setAllCombinations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [emojis, setEmojis] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // Track the search input
    const { width } = useWindowDimensions();
    const [favoriteExercices, setFavoriteExercices] = useState(null);
    const [favoriteExercicesPage, setFavoriteExercicesPage] = useState(1);
    const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
    const [loadingMoreFavorites, setLoadingMoreFavorites] = useState(false);
    const [combinationsPage, setCombinationsPage] = useState(1);
    const [hasMoreCombinations, setHasMoreCombinations] = useState(true);
    const [loadingMoreCombinations, setLoadingMoreCombinations] = useState(false);
    const [exerciceTypesPage, setExerciceTypesPage] = useState(1);
    const [hasMoreTypes, setHasMoreTypes] = useState(true);
    const [loadingMoreTypes, setLoadingMoreTypes] = useState(false);

    useEffect(() => {
        // Fetch exercise types from the API
        setLoading(true);

        // Fetch all data (exercise types, combinations, favorite exercices)
        const fetchAllData = async () => {
            try {
                // Fetch and process exercise types with pagination
                const response = await API.getExerciceTypes({ page: 1, limit: 7 });
                const fetchedTypes = response.data.exerciceTypes || [];
                setHasMoreTypes(response.data.pagination.hasMore);

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
                setExerciceTypes(typesWithExercises);

                // Fetch combinations with pagination
                const combinationsResponse = await API.getCombinations({ page: 1, limit: 7 });
                setAllCombinations(combinationsResponse.data.combinations);
                setHasMoreCombinations(combinationsResponse.data.pagination.hasMore);

                // Fetch favorite exercises with pagination
                const { favoriteExercices, pagination } = await apiCalls.fetchFavoriteExercices(
                    localStorage.getItem('id'),
                    1,
                    5
                );
                setFavoriteExercices(favoriteExercices);
                setHasMoreFavorites(pagination.hasMore);

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

    const loadMoreTypes = async () => {
        if (loadingMoreTypes || !hasMoreTypes) return;

        try {
            setLoadingMoreTypes(true);
            const nextPage = exerciceTypesPage + 1;

            // Fetch next page of exercise types
            const response = await API.getExerciceTypes({ page: nextPage, limit: 7 });
            const newTypes = response.data.exerciceTypes || [];

            // Fetch exercises for new types
            const newTypesWithExercises = await Promise.all(
                newTypes.map(async type => {
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

            setAllExerciceTypes(prev => [...prev, ...newTypesWithExercises]);
            setExerciceTypes(prev => [...prev, ...newTypesWithExercises]);
            setHasMoreTypes(response.data.pagination.hasMore);
            setExerciceTypesPage(nextPage);
        } catch (error) {
            console.error("Error loading more types:", error);
        } finally {
            setLoadingMoreTypes(false);
        }
    };

    const handleSearch = async (event) => {
        setSearchQuery(event.target.value);
        setCombinationsPage(1); // Reset page when searching

        if (event.target.value === '') {
            const response = await API.getCombinations({ page: 1, limit: 7 });
            setAllCombinations(response.data.combinations);
            setHasMoreCombinations(response.data.pagination.hasMore);
            return;
        }

        const response = await API.getCombinations({
            page: 1,
            limit: 7,
            search: event.target.value
        });
        setAllCombinations(response.data.combinations);
        setHasMoreCombinations(response.data.pagination.hasMore);
    };

    const loadMoreFavorites = async () => {
        if (loadingMoreFavorites || !hasMoreFavorites) return;

        try {
            setLoadingMoreFavorites(true);
            const nextPage = favoriteExercicesPage + 1;
            const { favoriteExercices: newFavorites, pagination } = await apiCalls.fetchFavoriteExercices(
                localStorage.getItem('id'),
                nextPage,
                5
            );

            setFavoriteExercices(prev => [...prev, ...newFavorites]);
            setHasMoreFavorites(pagination.hasMore);
            setFavoriteExercicesPage(nextPage);
        } catch (error) {
            console.error("Error loading more favorites:", error);
        } finally {
            setLoadingMoreFavorites(false);
        }
    };

    const loadMoreCombinations = async () => {
        if (loadingMoreCombinations || !hasMoreCombinations) return;

        try {
            setLoadingMoreCombinations(true);
            const nextPage = combinationsPage + 1;
            const response = await API.getCombinations({
                page: nextPage,
                limit: 7,
                search: searchQuery
            });

            setAllCombinations(prev => [...prev, ...response.data.combinations]);
            setHasMoreCombinations(response.data.pagination.hasMore);
            setCombinationsPage(nextPage);
        } catch (error) {
            console.error("Error loading more combinations:", error);
        } finally {
            setLoadingMoreCombinations(false);
        }
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

            <h1 style={{ margin: '0' }}>{index !== null ? "Modifier" : "Choisir"} un exercice</h1>

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
                        {hasMoreFavorites && (
                            <div
                                onClick={loadMoreFavorites}
                                className='sessionChoiceSmall'
                                style={{
                                    display: 'inline-block',
                                    textAlign: 'center',
                                    minWidth: '200px',
                                    cursor: 'pointer'
                                }}
                            >
                                {loadingMoreFavorites ? (
                                    <MiniLoader />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <div style={{ fontSize: width < 500 ? '18px' : '36px', filter: "invert(1)" }}>➕</div>
                                        <div>Voir plus</div>
                                    </div>
                                )}
                            </div>
                        )}
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
                    {allCombinations.length ? (
                        <>
                            {allCombinations.map((combination, index) => (
                                <div
                                    key={index}
                                    onClick={() => onSearch(combination)}
                                    className="inputClickable"
                                >
                                    {combination.combinationName.fr}
                                </div>
                            ))}
                            {hasMoreCombinations && (
                                <div
                                    onClick={loadMoreCombinations}
                                    className="inputClickable"
                                    style={{ textAlign: 'center', cursor: 'pointer' }}
                                >
                                    {loadingMoreCombinations ? (
                                        <MiniLoader />
                                    ) : (
                                        "Voir plus..."
                                    )}
                                </div>
                            )}
                        </>
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
                {hasMoreTypes && (
                    <div
                        onClick={loadMoreTypes}
                        className='sessionChoicePlus'
                        style={{ cursor: 'pointer' }}
                    >
                        {loadingMoreTypes ? (
                            <MiniLoader />
                        ) : (
                            <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ExerciceTypeChoice;
