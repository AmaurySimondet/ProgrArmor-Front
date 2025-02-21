import React, { useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const MealSummary = ({
    mealName,
    mealDateTime,
    selectedFoods,
    handleNameClick,
    handleDateClick,
    handleFoodClick,
    onDragFoods
}) => {
    const scrollableContainerRef = useRef(null);

    useEffect(() => {
        if (scrollableContainerRef.current) {
            scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
        }
    }, [selectedFoods]);

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        const reorderedFoods = Array.from(selectedFoods);
        const [removed] = reorderedFoods.splice(source.index, 1);
        reorderedFoods.splice(destination.index, 0, removed);

        onDragFoods(reorderedFoods);
    };

    return (
        <div>
            {mealName && mealDateTime && (
                <div className='sessionSummary'>
                    {/* Name and Date */}
                    <h2 className='popInElement'>
                        <span onClick={handleNameClick} className='clickable'>{mealName}</span>
                        {" - "}
                        <span onClick={handleDateClick} className='clickable'>{mealDateTime}</span>
                    </h2>

                    {/* Selected Food */}
                    {selectedFoods && (
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="foodList">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={(el) => {
                                            provided.innerRef(el);
                                            scrollableContainerRef.current = el;
                                        }}
                                        style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}
                                        onMouseEnter={() => {
                                            const element = document.querySelector('.sessionSummary');
                                            if (element) element.style.borderRight = '2px solid #f0f0f0';
                                        }}
                                    >
                                        {selectedFoods.map((food, idx) => (
                                            <Draggable key={idx} draggableId={String(idx)} index={idx}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={handleFoodClick}
                                                        className="sessionSummaryExercice"
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            transition: 'transform 0.2s ease'
                                                        }}
                                                    >
                                                        <div className="clickable progarmor-red">
                                                            <h3>{food.food_name} - {food.serving_units} {food.serving_unit}</h3>
                                                            <p>Calories: {food.serving_calories}kcal | Fat: {food.serving_fat}g | Carbs: {food.serving_carbs}g | Protein: {food.serving_protein}g</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}

                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: "-webkit-center" }}>
                        <li>Total: Calories: {Math.round(selectedFoods.reduce((sum, food) => sum + food.serving_calories, 0) * 100) / 100}kcal | Fat: {Math.round(selectedFoods.reduce((sum, food) => sum + food.serving_fat, 0) * 100) / 100}g | Carbs: {Math.round(selectedFoods.reduce((sum, food) => sum + food.serving_carbs, 0) * 100) / 100}g | Protein: {Math.round(selectedFoods.reduce((sum, food) => sum + food.serving_protein, 0) * 100) / 100}g</li>
                    </ul>

                    <p className='text-muted popInElement' style={{ fontSize: '0.8em', marginTop: "1rem" }}>
                        <i>Maintiens et glisse un aliment pour réorganiser</i>
                        <br />
                        <i>Clique sur le nom, la date ou l'aliment pour modifier</i>
                    </p>
                </div>
            )}
        </div>
    );
};

export default MealSummary; 