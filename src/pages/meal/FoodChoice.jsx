import React, { useState, useEffect } from 'react';
import { COLORS } from '../../utils/constants';
import API from '../../utils/API';
import { randomFoodEmojis } from '../../utils/emojis';
import { Loader } from '../../components/Loader';
import { useWindowDimensions } from '../../utils/useEffect';

const FoodChoice = ({ onNext, onBack }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(false);
    const [emojis, setEmojis] = useState(null);
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState('100');
    const [isUnitBased, setIsUnitBased] = useState(false);
    const [unitInfo, setUnitInfo] = useState(null);
    const { width } = useWindowDimensions();
    const [quantityOptions, setQuantityOptions] = useState([]);

    useEffect(() => {
        const searchFoods = async () => {
            if (searchQuery.trim() === '') {
                setFoods(null);
                return;
            }

            setLoading(true);
            try {
                const response = await API.searchFood(searchQuery);
                let foods = response.data.data.foods;
                console.log(foods);
                if (foods.total_results === '0') {
                    setFoods([]);
                } else {
                    // Convert keys to snake_case
                    const convertToSnakeCase = (food) => ({
                        food_id: food.food_id || food.foodId,
                        food_name: food.food_name || food.foodName,
                        food_description: food.food_description || food.foodDescription,
                        brand_name: food.brand_name || food.brandName,
                    });

                    // If total_results is 1, food is a dict not a list
                    if (foods.total_results === '1' && !Array.isArray(foods.food)) {
                        setFoods([convertToSnakeCase(foods.food)]);
                    } else {
                        setFoods(foods.food.map(convertToSnakeCase));
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(searchFoods, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        if (foods) {
            setEmojis(randomFoodEmojis(foods.length));
        }
    }, [foods]);

    useEffect(() => {
        if (selectedFood) {
            const unitRegex = /Per (\d+) (\w+) -/;
            const unitMatch = selectedFood.food_description.match(unitRegex);
            setIsUnitBased(!!unitMatch);
            if (unitMatch) {
                setUnitInfo({
                    perUnits: unitMatch[1],
                    unit: unitMatch[2]
                });
                setQuantity('1'); // Default to 1 unit
            } else {
                setQuantity('100'); // Default to 100g
            }
        }
    }, [selectedFood]);

    useEffect(() => {
        // Generate options from 1 to 2000
        const options = isUnitBased
            ? [...Array(100).keys()].map(i => i + 1)  // 1 to 100 for units
            : [...Array(2000).keys()].map(i => i + 1); // 1 to 2000 for grams
        setQuantityOptions(options);
    }, [isUnitBased]);

    const handleFoodSelect = (food) => {
        setSelectedFood(food);
    };

    const handleQuantitySubmit = () => {
        const gramRegex = /Per (\d+)g - Calories: ([\d.]+)kcal \| Fat: ([\d.]+)g \| Carbs: ([\d.]+)g \| Protein: ([\d.]+)g/;
        const unitRegex = /Per (\d+) (\w+) - Calories: ([\d.]+)kcal \| Fat: ([\d.]+)g \| Carbs: ([\d.]+)g \| Protein: ([\d.]+)g/;

        const gramMatch = selectedFood.food_description.match(gramRegex);
        const unitMatch = selectedFood.food_description.match(unitRegex);

        if (gramMatch) {
            // Handle per gram case
            const [, perGrams, calories, fat, carbs, protein] = gramMatch;
            const ratio = parseFloat(quantity) / parseFloat(perGrams);

            const nutritionData = {
                ...selectedFood,
                serving_unit: 'g',
                serving_units: parseFloat(quantity),
                serving_calories: Math.round(parseFloat(calories) * ratio),
                serving_fat: Math.round(parseFloat(fat) * ratio * 10) / 10,
                serving_carbs: Math.round(parseFloat(carbs) * ratio * 10) / 10,
                serving_protein: Math.round(parseFloat(protein) * ratio * 10) / 10
            };

            onNext(nutritionData);
            setSelectedFood(null);
            setSearchQuery('');
        } else if (unitMatch) {
            // Handle per unit case
            const [, perUnits, unit, calories, fat, carbs, protein] = unitMatch;
            const ratio = parseFloat(quantity) / parseFloat(perUnits);

            const nutritionData = {
                ...selectedFood,
                serving_unit: unit,
                serving_units: parseFloat(quantity),
                serving_calories: Math.round(parseFloat(calories) * ratio),
                serving_fat: Math.round(parseFloat(fat) * ratio * 10) / 10,
                serving_carbs: Math.round(parseFloat(carbs) * ratio * 10) / 10,
                serving_protein: Math.round(parseFloat(protein) * ratio * 10) / 10
            };

            onNext(nutritionData);
            setSelectedFood(null);
            setSearchQuery('');
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1 style={{ textAlign: 'center' }}>Ajouter un aliment</h1>
            <p style={{ textAlign: 'center', maxWidth: '600px', margin: '5% auto' }}><i>La recherche d'aliment ne fonctionne qu'en anglais pour le moment, désolé !</i></p>

            {/* Show quantity selector if food is selected */}
            {selectedFood && (
                <div className="popInElement" style={{ textAlign: 'center', margin: '20px 0' }}>
                    <h2>{selectedFood.food_name}</h2>
                    <div style={{ margin: '20px 0' }}>
                        <select
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            style={{
                                padding: '10px',
                                fontSize: '1rem',
                                width: '100px',
                                borderRadius: '5px',
                                backgroundColor: COLORS.lightRose,
                                marginRight: '10px'
                            }}
                        >
                            <option value="" disabled>
                                {isUnitBased ? 'Nombre' : 'Grammes'}
                            </option>
                            {quantityOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <span>{isUnitBased ? unitInfo.unit + '(s)' : 'grammes'}</span>
                    </div>
                    {isUnitBased && (
                        <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            Valeurs nutritionnelles par {unitInfo.perUnits} {unitInfo.unit}
                        </p>
                    )}
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            onClick={() => setSelectedFood(null)}
                            className="btn btn-white"
                        >
                            Retour
                        </button>
                        <button
                            onClick={handleQuantitySubmit}
                            className="btn btn-dark"
                        >
                            Valider
                        </button>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            {!selectedFood && (
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un aliment..."
                    style={{
                        padding: '10px',
                        fontSize: '1rem',
                        margin: '20px auto',
                        width: '80%',
                        maxWidth: '400px',
                        borderRadius: '5px',
                        backgroundColor: COLORS.lightRose,
                        display: 'block'
                    }}
                />
            )}

            {/* Food List */}
            <div className="sessionChoiceContainer">
                {loading ? (
                    <Loader />
                ) : (
                    foods ? (
                        foods.length > 0 ? (
                            foods.map((food, index) => (
                                <div
                                    key={food.food_id}
                                    onClick={() => handleFoodSelect(food)}
                                    className='sessionChoice'
                                    style={width <= 500 ? {
                                        width: 175,
                                        height: 175,
                                        fontSize: '0.8rem'
                                    } : null}
                                >
                                    <div style={{ fontSize: '24px' }}>{emojis[index]}</div>
                                    <strong>{food.food_name} {food.brand_name ? `- ${food.brand_name}` : ''}</strong>
                                    <div style={{ fontSize: '0.8rem' }}>
                                        {food.food_description}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>Aucun résultat trouvé</div>
                        )
                    ) : null
                )}
            </div>
        </div>
    );
};

export default FoodChoice; 