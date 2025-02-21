import { React, useState } from "react";
import NavigBar from "../../components/NavigBar.jsx"
import { COLORS } from "../../utils/constants.js";
import AppFooter from "../../components/AppFooter.jsx";
import FoodChoice from "./FoodChoice.jsx";
import FoodPost from './FoodPost';
import MealName from './MealName';
import MealDate from './MealDate';
import { useNavigate } from 'react-router-dom';
import MealProgressBar from './MealProgressBar';
import MealSummary from './MealSummary';

function Meal() {
    const [step, setStep] = useState(1);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [mealName, setMealName] = useState('');
    const [mealDateTime, setMealDateTime] = useState('');
    const navigate = useNavigate();

    const handleAddFood = (food) => {
        setSelectedFoods([...selectedFoods, food]);
    }

    const handleDragFoods = (reorderedFoods) => {
        setSelectedFoods(reorderedFoods);
    };

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="Meal" />

                <div className="content-wrap">
                    {step !== 4 && (
                        <>
                            <MealProgressBar
                                mealName={mealName}
                                mealDateTime={mealDateTime}
                                selectedFoods={selectedFoods}
                            />
                            <MealSummary
                                mealName={mealName}
                                mealDateTime={mealDateTime}
                                selectedFoods={selectedFoods}
                                handleNameClick={() => setStep(1)}
                                handleDateClick={() => setStep(2)}
                                handleFoodClick={() => selectedFoods && setStep(3)}
                                onDragFoods={handleDragFoods}
                            />
                        </>
                    )}

                    {step === 1 && (
                        <MealName
                            onNext={(name) => {
                                setMealName(name);
                                setStep(2);
                            }}
                            onBack={() => navigate(-1)}
                        />
                    )}

                    {step === 2 && (
                        <MealDate
                            onNext={(dateTime) => {
                                setMealDateTime(dateTime);
                                setStep(3);
                            }}
                            onBack={() => setStep(1)}
                        />
                    )}

                    {step === 3 && (
                        <FoodChoice
                            onNext={handleAddFood}
                            onBack={() => setStep(2)}
                        />
                    )}

                    {step === 4 && (
                        <FoodPost
                            selectedFoods={selectedFoods}
                            onBack={() => setStep(3)}
                        />
                    )}
                </div>

                <AppFooter />
            </div>
        </div>
    );
}

export default Meal;