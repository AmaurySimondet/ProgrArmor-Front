import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import Fuse from 'fuse.js';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import RenderExercice from './RenderExercice';

const CategoryTypeChoice = ({ onNext, onSkip, onBack, onSearch, index, exercice, onDeleteCategories, onDeleteLastCategorie }) => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [allCategoryTypes, setAllCategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const { width } = useWindowDimensions();
    const [emojis, setEmojis] = useState([]);
    const [clickedCategory, setClickedCategory] = useState(null); // State to track the clicked category

    useEffect(() => {
        // Fetch category types from the API
        API.getCategoryTypes()
            .then(response => {
                let fetchedTypes = response.data.categorieTypes || [];
                // Keep only name and examples
                fetchedTypes = fetchedTypes.map(type => ({
                    name: type.name.fr,
                    examples: type.examples.fr,
                }));
                setAllCategoryTypes(fetchedTypes);
                setCategoryTypes(fetchedTypes.slice(0, 10)); // Show only the first 3 types initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category types:", error);
                setLoading(false);
            });

        API.getCategories()
            .then(response => {
                const fetchedNames = response.data.categories || [];
                const uniqueNames = fetchedNames.map(categorie => categorie.name.fr).filter((value, index, self) => self.indexOf(value) === index);
                setAllCategories(uniqueNames);
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
    };

    // Configure Fuse.js for fuzzy searching
    const options = {
        includeScore: true,
        threshold: 0.7, // Adjust this for more or fewer matches (0 is exact match, 1 is very loose)
        keys: ['name'], // The key(s) you want to search within
    };

    const fuse = new Fuse(allCategories, options);
    const filteredCategories = fuse.search(searchQuery).map(result => result.item);

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allCategories.length));
    }, [allCategories]);

    // Handle category click with animation
    const handleCategoryClick = (categorie) => {
        setClickedCategory(categorie);
        onSearch(categorie);

        // Reset the clicked state after a short delay to reset the animation
        setTimeout(() => setClickedCategory(null), 500);
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
                                    onClick={() => handleCategoryClick(categorie)} // Use handleCategoryClick for animation
                                    className={`inputClickable ${clickedCategory === categorie ? 'clicked' : ''}`} // Add 'clicked' class when clicked
                                >
                                    {categorie}
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
                        onClick={() => onNext(type.name)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis[index]}</div>
                        <div>{type.name}</div>
                        <div style={{ fontSize: '0.66rem' }}>{type.examples.join(', ')}</div>
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
