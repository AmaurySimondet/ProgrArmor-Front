import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';

const CategoryChoice = ({ selectedType, onNext, onSkip, onBack }) => {

    // Check if selectedType is not a string
    if (typeof selectedType !== 'string') {
        return <div>Error: selectedType is not a string.</div>;
    }

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();

    useEffect(() => {
        // Simulate fetching categories from an API based on the selected type
        setTimeout(() => {
            setCategories(['Catégorie A', 'Catégorie B', 'Catégorie C']);
            setLoading(false);
        }, 1000);
    }, [selectedType]);

    const handleMoreCategories = () => {
        setCategories([...categories, 'Catégorie D', 'Catégorie E', 'Catégorie F']);
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
            <h1>Choisir une catégorie ({selectedType})</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        onClick={() => onNext(category)}
                        className='sessionChoice'
                    >
                        <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🏷️</div>
                        <div>{category}</div>
                    </div>
                ))}
                <div
                    onClick={handleMoreCategories}
                    className='sessionChoicePlus'
                >
                    <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                </div>
            </div>
        </div>
    );
};

export default CategoryChoice;

