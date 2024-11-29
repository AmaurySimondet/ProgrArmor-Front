import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import Fuse from 'fuse.js';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import RenderExercice from './RenderExercice';
import Alert from '../../components/Alert';

const CategoryTypeChoice = ({ onNext, onSkip, onBack, index, exercice, onDeleteCategories, onDeleteLastCategorie }) => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [allCategoryTypes, setAllCategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const { width } = useWindowDimensions();
    const [emojis, setEmojis] = useState([]);
    const [alert, setAlert] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState([]);

    const showAlert = (message, type) => {
        setAlert({ message, type });
    };

    const handleClose = () => {
        setAlert(null);
    };

    useEffect(() => {
        // Fetch category types from the API
        API.getCategoryTypes()
            .then(async response => {
                const fetchedTypes = response.data.categorieTypes || [];

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
                setCategoryTypes(typesWithCategories.slice(0, 8));
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category types:", error);
                setLoading(false);
            });

        API.getCategories()
            .then(response => {
                const categories = response.data.categories || [];
                setAllCategories(categories);
            })
            .catch(error => {
                console.error("Error fetching exercise names:", error);
            });
    }, []);

    const handleMoreTypes = () => {
        setCategoryTypes(allCategoryTypes); // Show all category types
        setMoreTypesUnclicked(false); // Hide the "More Types" button
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === '') {
            setFilteredCategories(allCategories.slice(0, 8));
            return;
        }
        const fuse = new Fuse(allCategories, { keys: ['name.fr'] });
        const results = fuse.search(event.target.value);
        setFilteredCategories(results.map(result => result.item));
    };

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allCategories.length));
    }, [allCategories]);

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

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h1
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
                </h1>
                <h1
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <span onClick={onSkip} style={{ cursor: 'pointer' }} className="clickable"> Passer &gt; </span>
                </h1>
            </div>
            <h1>{index !== null ? "Modifier les catégories" : "On ajoute du détail ?"}</h1>

            <RenderExercice exercice={exercice} />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button onClick={onDeleteCategories} className='btn btn-white'>Supprimer les détails</button>
                <button onClick={onDeleteLastCategorie} className='btn btn-white'>Supprimer dernier détail</button>
            </div>

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
                }}
            />

            {/* Search Results */}
            {
                searchQuery && (
                    <div style={{ marginBottom: '20px', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((categorie, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCategoryClick(categorie)}
                                    className="inputClickable"
                                >
                                    {categorie.name.fr}
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '10px', color: '#999' }}>Aucun résultat trouvé</div>
                        )}
                    </div>
                )
            }

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
                {moreTypesUnclicked && (
                    <div
                        onClick={handleMoreTypes}
                        className='sessionChoicePlus'
                        style={{ cursor: 'pointer', color: '#007bff' }}
                    >
                        <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default CategoryTypeChoice;
