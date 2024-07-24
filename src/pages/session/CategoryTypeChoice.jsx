import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';

const CategoryTypeChoice = ({ onNext, onSkip, onBack }) => {
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const [moreTypesUnclicked, setMoreTypesUnclicked] = useState(true);

    useEffect(() => {
        // Simulate fetching category types from an API
        setTimeout(() => {
            setCategoryTypes([{ name: 'Type A', id: 1, examples: ['Example 1', 'Example 2'] }, { name: 'Type B', id: 2, examples: ['Example 3', 'Example 4'] }, { name: 'Type C', id: 3, examples: ['Example 5', 'Example 6'] }]);
            setLoading(false);
        }, 1000);
    }, []);

    const handleMoreTypes = () => {
        setCategoryTypes([...categoryTypes, { name: 'Type D', id: 4, examples: ['Example 7', 'Example 8'] }, { name: 'Type E', id: 5, examples: ['Example 9', 'Example 10'] }, { name: 'Type F', id: 6, examples: ['Example 11', 'Example 12'] }]);
        setMoreTypesUnclicked(false);
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
                    >
                        <div style={width < 500 ? { fontSize: '24px' } : { fontSize: '48px' }}>➕</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryTypeChoice;
