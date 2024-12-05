import React, { useRef } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { renderSets } from '../../utils/sets';
import { randomBodybuildingEmojis } from '../../utils/emojis';


function InstagramCarousel({ selectedName, selectedExercices, recordSummary, backgroundColors }) {
    const emojis = randomBodybuildingEmojis(selectedExercices.length);
    const { width } = useWindowDimensions();
    const carouselRef = useRef(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);

    React.useEffect(() => {
        const carousel = carouselRef.current;

        const handleScroll = () => {
            if (carousel) {
                const scrollPosition = carousel.scrollLeft;

                // Define scroll position ranges based on your observed values
                let newSlide;
                if (width <= 500) { // Mobile
                    if (scrollPosition < 200) newSlide = 0;
                    else if (scrollPosition < 500) newSlide = 1;
                    else if (scrollPosition < 800) newSlide = 2;
                    else newSlide = 3;
                } else { // Desktop
                    if (scrollPosition < 150) newSlide = 0;
                    else if (scrollPosition < 450) newSlide = 1;
                    else if (scrollPosition < 750) newSlide = 2;
                    else newSlide = 3;
                }

                setCurrentSlide(newSlide);
            }
        };

        carousel?.addEventListener('scroll', handleScroll);
        return () => carousel?.removeEventListener('scroll', handleScroll);
    }, [width]); // Add width as a dependency

    const numberOfSlides = Math.ceil(selectedExercices.length / 2);

    return (
        <div style={{ position: 'relative' }}>
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

                {/* Each Exercise as a Slide */}
                {selectedExercices.map((exercice, idx) => {
                    // Only render pairs of exercises
                    if (idx % 2 !== 0) return null;

                    return (
                        <div
                            key={exercice._id}
                            className="instagramPost"
                            style={{ backgroundColor: backgroundColors[(idx / 2 + 1) % backgroundColors.length] }}
                        >
                            {/* First exercise in the pair */}
                            <ul style={{ listStyleType: 'none', ...(width < 500 ? { padding: '5px' } : {}) }}>
                                <li className="sessionSummaryExercice" style={{ position: 'relative', paddingLeft: '4em', marginBottom: "20px" }}>
                                    <span style={{ position: 'absolute', left: 0, top: 0, fontSize: width < 500 ? "2em" : "3em" }}>
                                        {emojis[idx]}
                                    </span>
                                    <h3 style={{ fontSize: "16px", fontWeight: "normal" }}>
                                        {selectedExercices[idx].exercice.name.fr}{' '}
                                        {selectedExercices[idx].categories.length > 0 &&
                                            '- ' + selectedExercices[idx].categories.map((category) => category.name.fr).join(', ')}
                                    </h3>
                                    {selectedExercices[idx].sets && selectedExercices[idx].sets.length > 0 && (
                                        <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center', fontSize: "14px" }}>
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
                                        <h3 style={{ fontSize: "16px", fontWeight: "normal" }}>
                                            {selectedExercices[idx + 1].exercice.name.fr}{' '}
                                            {selectedExercices[idx + 1].categories.length > 0 &&
                                                '- ' + selectedExercices[idx + 1].categories.map((category) => category.name.fr).join(', ')}
                                        </h3>
                                        {selectedExercices[idx + 1].sets && selectedExercices[idx + 1].sets.length > 0 && (
                                            <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center', fontSize: "14px" }}>
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

            {/* Add slide indicators */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0'
            }}>
                {[...Array(numberOfSlides)].map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: currentSlide === index ? '#9b0000' : 'rgba(128, 128, 128, 0.5)',
                            transition: 'background-color 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default InstagramCarousel;
