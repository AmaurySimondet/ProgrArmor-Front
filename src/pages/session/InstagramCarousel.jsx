import React, { useRef, useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import { renderSets } from '../../utils/sets';
import { randomBodybuildingEmojis } from '../../utils/emojis';
import API from '../../utils/API';
import { resizeImage, validateFileSize, MAX_FILE_SIZE } from '../../utils/mediaUtils';
import { uploadToS3 } from '../../utils/s3Upload';
import { VIDEO_FORMATS } from '../../utils/constants';

function InstagramCarousel({ seanceId, selectedName, selectedExercices, backgroundColors, editable, selectedDate, seancePhotos }) {
    const emojis = randomBodybuildingEmojis(selectedExercices.length);
    const { width } = useWindowDimensions();
    const carouselRef = useRef(null);
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [photos, setPhotos] = useState(seancePhotos ? seancePhotos.map(url => ({ cloudfrontUrl: url })) : []);
    const [imageUploading, setImageUploading] = useState(false);
    const [numberOfSlides, setNumberOfSlides] = useState(
        Math.ceil(selectedExercices.length / 2) + (seancePhotos?.length || 0)
    );
    const [deletingPhotos, setDeletingPhotos] = useState({});

    React.useEffect(() => {
        const carousel = carouselRef.current;

        const handleScroll = () => {
            if (carousel) {
                const scrollPosition = carousel.scrollLeft;
                const firstLastSlideWidth = width <= 500 ? 200 : 150;
                const slideWidth = 350;

                // Adjust calculation based on position
                let newSlide;
                if (scrollPosition < firstLastSlideWidth) {
                    newSlide = 0;
                } else if (scrollPosition > (numberOfSlides - 2) * slideWidth + firstLastSlideWidth) {
                    newSlide = numberOfSlides - 1;
                } else {
                    newSlide = Math.floor((scrollPosition - firstLastSlideWidth) / slideWidth) + 1;
                }

                setCurrentSlide(Math.min(newSlide, numberOfSlides - 1));
            }
        };

        carousel?.addEventListener('scroll', handleScroll);
        return () => carousel?.removeEventListener('scroll', handleScroll);
    }, [width, numberOfSlides, photos]); // Add width as a dependency

    React.useEffect(() => {
        const exerciseGroups = groupExercises(selectedExercices).length;
        const photoSlides = photos.length;
        setNumberOfSlides(exerciseGroups + photoSlides);
    }, [selectedExercices, photos.length]); // Make sure to include groupExercises in dependencies if needed

    React.useEffect(() => {
        if (editable) {  // Only fetch if we don't have seancePhotos
            const fetchPhotos = async () => {
                let updatedPhotos = [];
                if (seanceId) {
                    const seancePhotos = await API.getPhotosBySeanceId(seanceId).then((response) => {
                        return response.data.images;
                    });
                    updatedPhotos = updatedPhotos.concat(seancePhotos);
                }
                else {
                    let seancePhotos = await API.getPhotos(localStorage.getItem('id'), selectedDate, selectedName).then((response) => {
                        return response.data.images;
                    });
                    updatedPhotos = updatedPhotos.concat(seancePhotos);
                }
                setPhotos(updatedPhotos);
            };
            fetchPhotos();
        }
    }, []);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        try {
            setImageUploading(true);

            for (const file of files) {
                try {
                    // Validate file size
                    validateFileSize(file);

                    // Process file based on type
                    let processedFile;
                    if (file.type.startsWith('image/')) {
                        processedFile = await resizeImage(file);
                    } else if (file.type.startsWith('video/')) {
                        if (file.size > MAX_FILE_SIZE) {
                            throw new Error('La vidéo est trop volumineuse. Veuillez la compresser avant de la télécharger.');
                        }
                        processedFile = file;
                    } else {
                        throw new Error('Format de fichier non supporté');
                    }

                    // Upload directly to S3
                    const uploadResult = await uploadToS3(processedFile, localStorage.getItem('id'));

                    // Record in MongoDB
                    await API.uploadSeancePhoto(
                        uploadResult,
                        selectedDate,
                        selectedName,
                        localStorage.getItem('id')
                    );
                } catch (error) {
                    console.error('Error processing file:', error);
                    alert(error.message);
                    continue;
                }
            }

            // Get updated photos after all uploads
            let updatedPhotos = await API.getPhotos(localStorage.getItem('id'), selectedDate, selectedName)
                .then((response) => response.data.images);

            if (seanceId) {
                const seancePhotos = await API.getPhotosBySeanceId(seanceId)
                    .then((response) => response.data.images);
                updatedPhotos = updatedPhotos.concat(seancePhotos);
            }
            setPhotos(updatedPhotos);

            // Reset the file input value
            event.target.value = '';

        } catch (error) {
            console.error("Error uploading images:", error);
            alert("Erreur lors du téléchargement des images");
        } finally {
            setImageUploading(false);
        }
    };

    const handleDeleteImage = async (photoUrl) => {
        try {
            setDeletingPhotos(prev => ({ ...prev, [photoUrl]: true }));
            await API.deleteSeancePhoto(photoUrl);
            setPhotos(photos.filter(photo => photo.cloudfrontUrl !== photoUrl));
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Erreur lors de la suppression de l'image");
        } finally {
            setDeletingPhotos(prev => ({ ...prev, [photoUrl]: false }));
        }
    };

    // New function to estimate exercise height
    const estimateExerciseHeight = (exercise) => {
        const BASE_HEIGHT = 70; // Base height for exercise name and emoji
        const SET_HEIGHT = 25; // Height per set
        const setsCount = exercise.sets?.length || 0;
        return BASE_HEIGHT + (setsCount * SET_HEIGHT);
    };

    // New function to group exercises
    const groupExercises = (exercises) => {
        const MAX_HEIGHT = 400; // Maximum height for a slide
        const groups = [];
        let currentGroup = [];
        let currentHeight = 0;

        exercises.forEach((exercise) => {
            const exerciseHeight = estimateExerciseHeight(exercise);

            if (currentHeight + exerciseHeight > MAX_HEIGHT) {
                // Start new group if current one would exceed max height
                groups.push(currentGroup);
                currentGroup = [exercise];
                currentHeight = exerciseHeight;
            } else {
                currentGroup.push(exercise);
                currentHeight += exerciseHeight;
            }
        });

        // Add remaining exercises
        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Photo Upload Section */}
            {editable && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <input
                        type="file"
                        id="photos"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                    <div
                        style={{
                            border: '2px dashed #ccc',
                            borderRadius: '8px',
                            padding: '20px',
                            cursor: 'pointer',
                            position: 'relative',
                            opacity: imageUploading ? 0.5 : 1
                        }}
                        onClick={() => document.getElementById('photos').click()}
                    >
                        <img
                            src={require('../../images/icons/camera.webp')}
                            alt="upload"
                            style={{ width: '30px', height: '30px', marginBottom: '10px' }}
                        />
                        <p style={{ margin: '0' }}>Ajouter des photos ou vidéos de la séance</p>

                        {imageUploading && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '30px',
                                height: '30px',
                                border: '3px solid #f3f3f3',
                                borderTop: '3px solid #3498db',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }} />
                        )}
                    </div>
                </div>
            )}

            {/* Existing Carousel Content */}
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
                    position: 'relative',
                    justifyContent: numberOfSlides == 1 ? 'center' : 'flex-start',
                }}
                className="carousel-container"
            >
                {photos.length > 0 && (
                    photos.map((photo, idx) => (
                        <div className="instagramPost popInElement" style={{ padding: '0', position: 'relative' }}>
                            {VIDEO_FORMATS.includes(photo.cloudfrontUrl.toLowerCase().split('.').pop()) ? (
                                <video
                                    controls
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: deletingPhotos[photo.cloudfrontUrl] ? 0.5 : 1
                                    }}
                                >
                                    <source src={photo.cloudfrontUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <img
                                    src={photo.cloudfrontUrl}
                                    alt="seance"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        opacity: deletingPhotos[photo.cloudfrontUrl] ? 0.5 : 1
                                    }}
                                />
                            )}
                            {editable && (
                                <button
                                    onClick={() => handleDeleteImage(photo.cloudfrontUrl)}
                                    disabled={deletingPhotos[photo.cloudfrontUrl]}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'red',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        cursor: deletingPhotos[photo.cloudfrontUrl] ? 'not-allowed' : 'pointer',
                                        textAlign: 'center',
                                        lineHeight: '20px',
                                    }}
                                >
                                    {deletingPhotos[photo.cloudfrontUrl] ? '...' : '×'}
                                </button>
                            )}
                        </div>
                    ))
                )}

                {/* Exercise Groups */}
                {groupExercises(selectedExercices).map((group, groupIdx) => (
                    <div
                        key={`group-${groupIdx}`}
                        className="instagramPost"
                        style={{ backgroundColor: backgroundColors[groupIdx % backgroundColors.length] }}
                    >
                        <ul style={{ listStyleType: 'none', ...(width < 500 ? { padding: '5px' } : {}) }}>
                            {group.map((exercise, idx) => (
                                <li
                                    key={exercise._id}
                                    className="sessionSummaryExercice"
                                    style={{
                                        position: 'relative',
                                        paddingLeft: '4em',
                                        marginBottom: idx < group.length - 1 ? "20px" : "0"
                                    }}
                                >
                                    <span style={{ position: 'absolute', left: 0, top: 0, fontSize: width < 500 ? "2em" : "3em" }}>
                                        {emojis[selectedExercices.indexOf(exercise)]}
                                    </span>
                                    <h3 style={{ fontSize: "16px", fontWeight: "normal" }}>
                                        {exercise.exercice.name.fr}{' '}
                                        {exercise.categories.length > 0 &&
                                            '- ' + exercise.categories.map((category) => category.name.fr).join(', ')}
                                    </h3>
                                    {exercise.sets && exercise.sets.length > 0 && (
                                        <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center', fontSize: "14px" }}>
                                            {renderSets(exercise.sets, false, "")}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
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
