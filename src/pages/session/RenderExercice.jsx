import React from "react";
import { renderSets } from "../../utils/sets";

const RenderExercice = ({ exercice }) => {
    return <div
        className="sessionSummaryExercice popInElement"
    >
        <h3 style={{ marginBottom: '20px' }}>
            {exercice.exercice && exercice.exercice}{exercice.categories.length > 0 && " - " + exercice.categories.join(', ')}
        </h3>
        {exercice.sets && exercice.sets.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {renderSets(exercice.sets)}
            </ul>
        )}
    </div>;
}

export default RenderExercice;