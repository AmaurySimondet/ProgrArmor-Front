import React from "react";
import { renderSets } from "../../utils/sets";

const RenderExercice = ({ exercice, sets }) => {
    let setsToRender = exercice.sets;
    if (sets) {
        setsToRender = sets;
    }

    return <div
        className="sessionSummaryExercice popInElement"
    >
        <h2 style={{ marginBottom: '20px', fontWeight: '500' }}>
            {exercice.exercice.name.fr && exercice.exercice.name.fr}{exercice.categories.length > 0 && " - " + exercice.categories.map((category) => category.name.fr).join(', ')}
        </h2>
        {setsToRender && setsToRender.length > 0 && (
            <ul style={{ listStyleType: 'none', padding: 0, textAlign: "-webkit-center" }}>
                {renderSets(setsToRender, true)}
            </ul>
        )}
    </div>;
}

export default RenderExercice;