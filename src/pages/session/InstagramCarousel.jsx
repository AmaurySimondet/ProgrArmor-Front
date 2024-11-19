import React, { useRef } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { renderSets } from '../../utils/sets';
import { randomBodybuildingEmojis } from '../../utils/emojis';


function InstagramCarousel({ selectedName, selectedExercices, recordSummary, backgroundColors }) {
    const emojis = randomBodybuildingEmojis(selectedExercices.length);
    const { width } = useWindowDimensions();
    const carouselRef = useRef(null);

    return (
        <div
            key={selectedName}
            ref={carouselRef}
            style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                gap: '20px',
                paddingBottom: '20px',
                scrollbarWidth: 'none',
                position: 'relative', // Required for the index positioning
            }}
            className="carousel-container"
        >

            {/* Rest of your carousel code here */}
            <div
                className="instagramPost"
                style={{
                    backgroundColor: backgroundColors[0],
                    ...(width < 500 ? { width: width - 30, height: width - 30 } : {}),
                }}
            >
                <p><strong>{selectedName}</strong></p>
                <h3>Résumé des records</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {recordSummary.length > 0 ? recordSummary.map((record, idx) => (
                        <li key={record.PR}
                            className={`${record.PR ? 'personal-record' : ''}`.trim()}
                            style={record.PR === 'PR' ? { backgroundColor: "#e0ffe0", border: "2px solid #00c853" } : record.PR === "SB" ? { backgroundColor: "#fff9c4", border: "2px solid #ffeb3b" } : {}}>
                            <span className="pr-badge" style={record.PR === 'PR' ? { color: "#00c853" } : { color: "rgb(255 178 59)" }}>
                                🎉 {record.PR} x {record.number} 🎉
                            </span>
                        </li>
                    )) : <li>Pas de record pour cette séance</li>}
                </ul>
            </div>

            {/* Each Exercise as a Slide */}
            {selectedExercices.map((exercice, idx) => {
                // Only render pairs of exercises
                if (idx % 2 !== 0) return null;

                return (
                    <div
                        key={exercice._id}
                        className="instagramPost"
                        style={{
                            backgroundColor: backgroundColors[(idx / 2 + 1) % backgroundColors.length],
                            ...(width < 500 ? { width: width - 30, height: width - 30 } : {}),
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            justifyContent: 'center',
                        }}
                    >
                        {/* First exercise in the pair */}
                        <ul style={{ listStyleType: 'none', ...(width < 500 ? { padding: '5px' } : {}) }}>
                            <li className="sessionSummaryExercice" style={{ position: 'relative', paddingLeft: '4em', marginBottom: "20px" }}>
                                <span style={{ position: 'absolute', left: 0, top: 0, fontSize: width < 500 ? "2em" : "3em" }}>
                                    {emojis[idx]}
                                </span>
                                <h3>
                                    {selectedExercices[idx].exercice.name.fr}{' '}
                                    {selectedExercices[idx].categories.length > 0 &&
                                        '- ' + selectedExercices[idx].categories.map((category) => category.name.fr).join(', ')}
                                </h3>
                                {selectedExercices[idx].sets && selectedExercices[idx].sets.length > 0 && (
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center' }}>
                                        {renderSets(selectedExercices[idx].sets, false, "")}
                                    </ul>
                                )}
                            </li>

                            {/* Second exercise in the pair, if it exists */}
                            {selectedExercices[idx + 1] && (
                                <li className="sessionSummaryExercice" style={{ position: 'relative', paddingLeft: '4em' }}>
                                    <span style={{ position: 'absolute', left: 0, top: 0, fontSize: width < 500 ? "2em" : "3em" }}>
                                        {emojis[idx + 1]}
                                    </span>
                                    <h3>
                                        {selectedExercices[idx + 1].exercice.name.fr}{' '}
                                        {selectedExercices[idx + 1].categories.length > 0 &&
                                            '- ' + selectedExercices[idx + 1].categories.map((category) => category.name.fr).join(', ')}
                                    </h3>
                                    {selectedExercices[idx + 1].sets && selectedExercices[idx + 1].sets.length > 0 && (
                                        <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center' }}>
                                            {renderSets(selectedExercices[idx + 1].sets, false, "")}
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

export default InstagramCarousel;
