import React from 'react';
import { renderSets } from '../../utils/sets';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const SessionSummary = ({
    selectedName,
    selectedDate,
    selectedExercices,
    handleExerciceClick,
    onFinish,
    index,
    handleDateClick,
    handleNameClick,
    onNewExercice,
    onDragExercices,
    setEditingExerciceIndex
}) => {

    const onDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return; // If dropped outside the list

        const reorderedExercices = Array.from(selectedExercices);
        const [removed] = reorderedExercices.splice(source.index, 1);
        reorderedExercices.splice(destination.index, 0, removed);

        onDragExercices(reorderedExercices); // Update state with reordered items
        // also update index if it was not null
        if (index !== null) {
            console.log('New index:', destination.index);
            setEditingExerciceIndex(destination.index);
        }
    };

    return (
        <div>
            {selectedName && selectedDate && (
                <div className='sessionSummary'>
                    {/* Name and Date */}
                    <h2 className='popInElement'>
                        <span onClick={handleNameClick} className='clickable'> {selectedName}</span>
                        {" - "}
                        <span onClick={handleDateClick} className='clickable'>{selectedDate}</span>
                    </h2>

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="exerciceList">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}
                                    // on mouse, show something to indicate that the list can be scrolled
                                    onMouseEnter={() => {
                                        const element = document.querySelector('.sessionSummary');
                                        if (element) element.style.borderRight = '2px solid #f0f0f0';
                                    }}
                                >
                                    {selectedExercices.map((exercice, idx) => (
                                        <Draggable key={idx} draggableId={String(idx)} index={idx}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => handleExerciceClick(idx)}
                                                    className={"sessionSummaryExercice"}
                                                >
                                                    <h3 className={idx === index ? 'clickable' : "clickable progarmor-red"}>
                                                        {idx === index && "---> "}{exercice.exercice.name.fr && exercice.exercice.name.fr}
                                                        {exercice.categories.length > 0 && " - " + exercice.categories.map((category) => category.name.fr).join(', ')}
                                                    </h3>
                                                    {exercice.sets && exercice.sets.length > 0 && (
                                                        <ul style={{ listStyleType: 'none', padding: 0, textAlign: "-webkit-center" }}>
                                                            {renderSets(exercice.sets)}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '10px' }}>
                        <button onClick={() => onNewExercice()} className='btn btn-white mt-2 popInElement'>
                            Ajouter un exercice
                        </button>
                        <button onClick={() => onFinish()} className='btn btn-black mt-2 popInElement'>
                            Séance terminée
                        </button>
                    </div>

                    <p className='text-muted popInElement' style={{ fontSize: '0.8em', marginTop: "1rem" }}>
                        <i>Maintiens et glisse un exercice pour réorganiser</i>
                        <br />
                        <i>Clique sur le nom, la date ou l'exercice pour modifier / supprimer</i>
                    </p>
                </div>
            )}
        </div>
    );
};

export default SessionSummary;
