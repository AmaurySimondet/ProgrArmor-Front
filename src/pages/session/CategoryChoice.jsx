import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';

const CategoryChoice = ({ selectedType, onNext, onSkip, onBack }) => {
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
            <h2
                onClick={onBack}
                style={{ cursor: 'pointer', color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                &lt; Retour
            </h2>
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
            <button
                onClick={onSkip}
                style={{ marginTop: '20px', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#9b0000', color: 'white', cursor: 'pointer' }}
            >
                Passer
            </button>
        </div>
    );
};

export default CategoryChoice;
