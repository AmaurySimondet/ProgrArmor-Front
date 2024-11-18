import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API';
import RenderExercice from './RenderExercice';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import Fuse from 'fuse.js';

const CategoryChoice = ({ selectedType, onNext, onSkip, onBack, index, exercice }) => {
    const [categories, setCategories] = useState([]);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [emojis, setEmojis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreCategoriesUnclicked, setMoreCategoriesUnclicked] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { width } = useWindowDimensions();

    useEffect(() => {
        // if selectedType is null, go back
        if (!selectedType) {
            onBack();
        }

        // First get exericeType id from name
        API.getCategorieType({ name: selectedType }) // Replace with the actual method to fetch categories
            .then(response => {
                setSelectedTypeId(response.data.categorieTypeReturned._id);
            }
            )
            .catch(error => {
                console.error("Error fetching categories:", error);
                setLoading(false);
            }
            );
    }, [selectedType]);


    useEffect(() => {
        // Only fetch categories if selectedTypeId is valid (not null)
        if (selectedTypeId) {
            setLoading(true); // Set loading to true before fetching categories
            API.getCategories({ categorieType: selectedTypeId }) // Replace with the actual method to fetch categories
                .then(response => {
                    let fetchedCategories = response.data.categories || [];
                    setAllCategories(fetchedCategories);
                    setCategories(fetchedCategories.slice(0, 3)); // Show only the first 3 categories initially
                    setLoading(false); // Set loading to false after fetching
                })
                .catch(error => {
                    console.error("Error fetching categories:", error);
                    setLoading(false); // Set loading to false if there is an error
                });
        }
    }, [selectedTypeId]); // Runs only when selectedTypeId changes

    useEffect(() => {
        setEmojis(randomBodybuildingEmojis(allCategories.length));
    }, [allCategories]);

    const handleMoreCategories = () => {
        setCategories(allCategories); // Show all categories
        setMoreCategoriesUnclicked(false); // Hide the "More Categories" button
    };

    if (loading) {
        return <Loader />;
    }

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
        if (event.target.value === '') {
            setCategories(allCategories.slice(0, 3));
            setMoreCategoriesUnclicked(true);
            return;
        }
        setMoreCategoriesUnclicked(false);
        const fuse = new Fuse(allCategories, { keys: ['name.fr'] });
        const results = fuse.search(event.target.value);
        setCategories(results.map(result => result.item));
    };

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

            <h1>{index !== null ? "Modifier" : "Choisir"} une catégorie ({selectedType})</h1>

            <RenderExercice exercice={exercice} />

            {/* Search Bar */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Ou rechercher une catégorie..."
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
                {categories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(category)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>{emojis[index]}</div>
                        <div>{category.name.fr}</div>
                    </div>
                ))}
                {moreCategoriesUnclicked && allCategories.length > 3 && (
                    <div
                        onClick={handleMoreCategories}
                        className='sessionChoicePlus'
                    >
                        <div style={width < 500 ? { fontSize: '18px' } : { fontSize: '36px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryChoice;

