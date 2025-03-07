import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { Loader, MiniLoader } from '../../components/Loader';
import API from '../../utils/API';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import RenderExercice from './RenderExercice';
import Alert from '../../components/Alert';
import { COLORS } from '../../utils/constants';

const CategoryTypeChoice = ({ onNext, onSkip, onBack, index, exercice, onDeleteCategories, onDeleteLastCategorie }) => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const { width } = useWindowDimensions();
    const [emojis, setEmojis] = useState([]);
    const [alert, setAlert] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [allCategoryTypes, setAllCategoryTypes] = useState([]);
    const [categoryTypesPage, setCategoryTypesPage] = useState(1);
    const [hasMoreTypes, setHasMoreTypes] = useState(true);
    const [loadingMoreTypes, setLoadingMoreTypes] = useState(false);
    const [categoriesPage, setCategoriesPage] = useState(1);
    const [hasMoreCategories, setHasMoreCategories] = useState(true);
    const [loadingMoreCategories, setLoadingMoreCategories] = useState(false);
    const [favoriteCategories, setFavoriteCategories] = useState([]);
    const [favoriteCategoriesPage, setFavoriteCategoriesPage] = useState(1);
    const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
    const [loadingMoreFavorites, setLoadingMoreFavorites] = useState(false);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    useEffect(() => {
        // Fetch category types from the API
        API.getCategoryTypes({ page: 1, limit: 7 })
            .then(async response => {
                const fetchedTypes = response.data.categorieTypes || [];
                setHasMoreTypes(response.data.pagination.hasMore);

                // Fetch categories for each type
                const typesWithCategories = await Promise.all(
                    fetchedTypes.map(async type => {
                        try {
                            const categoriesResponse = await API.getCategories({ categorieType: type._id });
                            return {
                                ...type,
                                categories: categoriesResponse.data.categories || []
                            };
                        } catch (error) {
                            console.error(`Error fetching categories for type ${type.name.fr}:`, error);
                            return {
                                ...type,
                                categories: []
                            };
                        }
                    })
                );

                setAllCategoryTypes(typesWithCategories);
                setCategoryTypes(typesWithCategories);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category types:", error);
                setLoading(false);
            });

        API.getCategories({ page: 1, limit: 7 })
            .then(response => {
                const categories = response.data.categories || [];
                setAllCategories(categories);
                setFilteredCategories(categories);
                setHasMoreCategories(response.data.pagination.hasMore);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });

        // Fetch favorite categories for this exercise
        API.fetchFavoriteCategories(exercice.exercice._id, 1, 5)
            .then(response => {
                const { categories, pagination } = response.data;
                console.log(categories, pagination);
                setFavoriteCategories(categories);
                setHasMoreFavorites(pagination.hasMore);
            })
            .catch(error => {
                console.error("Error fetching favorite categories:", error);
            });
    }, [exercice._id]);

    const loadMoreTypes = async () => {
        if (loadingMoreTypes || !hasMoreTypes) return;

        try {
            setLoadingMoreTypes(true);
            const nextPage = categoryTypesPage + 1;

            // Fetch next page of category types
            const response = await API.getCategoryTypes({ page: nextPage, limit: 7 });
            const newTypes = response.data.categorieTypes || [];

            // Fetch categories for new types
            const newTypesWithCategories = await Promise.all(
                newTypes.map(async type => {
                    try {
                        const categoriesResponse = await API.getCategories({ categorieType: type._id });
                        return {
                            ...type,
                            categories: categoriesResponse.data.categories || []
                        };
                    } catch (error) {
                        console.error(`Error fetching categories for type ${type.name.fr}:`, error);
                        return {
                            ...type,
                            categories: []
                        };
                    }
                })
            );

            setAllCategoryTypes(prev => [...prev, ...newTypesWithCategories]);
            setCategoryTypes(prev => [...prev, ...newTypesWithCategories]);
            // Update emojis for new length
            setEmojis(prev => [...prev, ...randomBodybuildingEmojis(newTypes.length)]);
            setHasMoreTypes(response.data.pagination.hasMore);
            setCategoryTypesPage(nextPage);
        } catch (error) {
            console.error("Error loading more types:", error);
        } finally {
            setLoadingMoreTypes(false);
        }
    };

    const handleSearch = async (event) => {
        setSearchQuery(event.target.value);
        setCategoriesPage(1); // Reset page when searching

        try {
            const response = await API.getCategories({
                page: 1,
                limit: 7,
                search: event.target.value
            });
            setFilteredCategories(response.data.categories);
            setHasMoreCategories(response.data.pagination.hasMore);
        } catch (error) {
            console.error("Error searching categories:", error);
        }
    };

    const loadMoreCategories = async () => {
        if (loadingMoreCategories || !hasMoreCategories) return;

        try {
            setLoadingMoreCategories(true);
            const nextPage = categoriesPage + 1;

            const response = await API.getCategories({
                page: nextPage,
                limit: 7,
                search: searchQuery
            });

            setFilteredCategories(prev => [...prev, ...response.data.categories]);
            setHasMoreCategories(response.data.pagination.hasMore);
            setCategoriesPage(nextPage);
        } catch (error) {
            console.error("Error loading more categories:", error);
        } finally {
            setLoadingMoreCategories(false);
        }
    };

    const loadMoreFavorites = async () => {
        if (loadingMoreFavorites || !hasMoreFavorites) return;

        try {
            setLoadingMoreFavorites(true);
            const nextPage = favoriteCategoriesPage + 1;
            const response = await API.fetchFavoriteCategories(
                exercice.exercice._id,
                nextPage,
                5
            );

            setFavoriteCategories(prev => [...prev, ...response.data.categories]);
            setHasMoreFavorites(response.data.pagination.hasMore);
            setFavoriteCategoriesPage(nextPage);
        } catch (error) {
            console.error("Error loading more favorites:", error);
        } finally {
            setLoadingMoreFavorites(false);
        }
    };

    useEffect(() => {
        // Update emojis whenever categoryTypes changes
        setEmojis(randomBodybuildingEmojis(categoryTypes.length));
    }, [categoryTypes]);

    // Handle category click with animation
    const handleCategoryClick = (categorie) => {
        if (exercice.categories.some(c => c._id === categorie._id)) {
            showAlert("Détail déjà ajouté !", "error");
            return;
        }
        onNext(categorie);
        showAlert("Détail ajouté ! Encore un autre ?", "success");
        setSearchQuery('');
    };

    const handleCategoriesClick = (categories) => {
        const recreatedCategories = categories._id.map((categorie, index) => ({
            _id: categorie.category,
            type: categorie.categoryType,
            name: categories.name[index]
        }));
        onNext(recreatedCategories);
        showAlert("Détails ajoutés !", "success");
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h1
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
                >
                    <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
                </h1>
                <h1
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
                >
                    <span onClick={onSkip} style={{ cursor: 'pointer' }} className="clickable"> Passer &gt; </span>
                </h1>
            </div>
            <h1 style={{ margin: '20px' }}>{index !== null ? "On va modifier ces détails" : "On ajoute du détail ?"}</h1>

            <RenderExercice exercice={exercice} />

            <div>
                {exercice.categories.length > 0 && <div className="popInElement" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={onDeleteCategories} className='btn btn-white'>Supprimer les détails</button>
                    <button onClick={onDeleteLastCategorie} className='btn btn-white'>Supprimer dernier détail</button>
                </div>}

                {alert && <Alert message={alert.message} type={alert.type} onClose={handleClose} />}

                {/* Search Bar */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Rechercher un détail..."
                    style={{
                        padding: '10px',
                        fontSize: '1rem',
                        margin: '20px 0',
                        width: '80%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        backgroundColor: COLORS.lightRose
                    }}
                />
            </div>

            {/* Search Results */}
            {
                searchQuery && (
                    <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredCategories.length > 0 ? (
                            <>
                                {filteredCategories.map((categorie, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleCategoryClick(categorie)}
                                        className="inputClickable"
                                    >
                                        {categorie.name.fr}
                                    </div>
                                ))}
                                {hasMoreCategories && (
                                    <div
                                        onClick={loadMoreCategories}
                                        className="inputClickable"
                                        style={{ textAlign: 'center', cursor: 'pointer' }}
                                    >
                                        {loadingMoreCategories ? (
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
                )
            }

            {/* Favorite Categories */}
            {favoriteCategories.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ color: '#9b0000' }}>Détails habituels</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            maxWidth: '95vw',
                            margin: '0 auto',
                            marginBottom: '20px',
                            maxHeight: '250px',
                            overflowX: 'auto',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {favoriteCategories.map((favorite, index) => (
                            favorite._id.length > 0 && (
                                <div
                                    key={index}
                                    onClick={() => handleCategoriesClick(favorite)}
                                    className='sessionChoiceSmall'
                                    style={{
                                        display: 'inline-block',
                                        textAlign: 'center',
                                        minWidth: '200px',
                                        whiteSpace: 'normal',
                                    }}
                                >
                                    <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>📝</div>
                                    <div>
                                        <div style={{ fontSize: '0.9em' }}>{favorite.name.map((n, i) => `${n.fr}${i < favorite.name.length - 1 ? ', ' : ''}`).join('')}</div>
                                        <div style={{ fontSize: '0.8em', color: 'lightgray' }}>
                                            Utilisé {favorite.count} fois
                                        </div>
                                    </div>
                                </div>
                            )
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
            )}

            {/* Category Type List */}
            <div className="sessionChoiceContainer">
                {categoryTypes.map((type, index) => (
                    <div
                        key={index}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis[index]}</div>
                        <div>{type.name.fr}</div>
                        <select
                            className="form-control"
                            onChange={(e) => {
                                const selectedCategory = type.categories.find(cat => cat._id === e.target.value);
                                showAlert("Détail ajouté ! Encore un autre ?", "success");
                                handleCategoryClick(selectedCategory);
                            }}
                            style={{ fontSize: '0.8rem', marginTop: '5px' }}
                        >
                            <option value="">Sélectionner une catégorie</option>
                            {type.categories?.map((category, i) => (
                                <option key={i} value={category._id}>
                                    {category.name.fr}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
                {hasMoreTypes && (
                    <div
                        onClick={loadMoreTypes}
                        className='sessionChoicePlus'
                        style={{ cursor: 'pointer', color: '#007bff' }}
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

export default CategoryTypeChoice;
