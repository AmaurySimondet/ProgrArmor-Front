import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import API from '../../utils/API'; // Ensure the API module is correctly imported

const CategoryTypeChoice = ({ onNext, onSkip, onBack }) => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [allCategoryTypes, setAllCategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Fetch category types from the API
        API.getCategoryTypes() // Replace with the actual method to fetch category types
            .then(response => {
                console.log(response.data.categorieTypes);
                let fetchedTypes = response.data.categorieTypes || [];
                // keep only name
                fetchedTypes = fetchedTypes.map(type => ({ name: type.name.fr, examples: type.examples.fr }));
                setAllCategoryTypes(fetchedTypes);
                setCategoryTypes(fetchedTypes.slice(0, 3)); // Show only the first 3 types initially
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching category types:", error);
                setLoading(false);
            });
    }, []);

    const handleMoreTypes = () => {
        setCategoryTypes(allCategoryTypes); // Show all category types
        setMoreTypesUnclicked(false); // Hide the "More Types" button
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h2
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
                </h2>
                <h2
                    style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                    <span onClick={onSkip} style={{ cursor: 'pointer' }} className="clickable"> Passer &gt; </span>
                </h2>
            </div>
            <h1>Choisir le type de catégorie</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {categoryTypes.map((type, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(type.name)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🏷️</div>
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
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryTypeChoice;
