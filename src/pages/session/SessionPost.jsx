import React, { useState, useEffect } from 'react';
import { renderSets } from '../../utils/sets';
import { useWindowDimensions } from '../../utils/useEffect';
import { InlineEditable } from '../../components/InlineEditable';
import { getUserById } from '../../utils/user';
import Loader from '../../components/Loader';

const SessionPost = ({ selectedName, selectedDate, selectedExercices, onBack }) => {
    const [postTitle, setPostTitle] = useState('Le titre');
    const [postDescription, setPostDescription] = useState('La description');
    const [location, setLocation] = useState('Le lieu');
    const [recordSummary, setRecordSummary] = useState(null);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake API call to get record summary based on selected exercises
        const fetchRecordSummary = async () => {
            // Simulated API response
            const trophies = selectedExercices.map((exercice) => ({
                exercice: exercice.exercice.name.fr + (exercice.categories.length > 0 ? ' - ' + exercice.categories.map((category) => category.name.fr).join(', ') : ''),
                trophies: Math.random() > 0.5 ? '🏆' : '', // Randomly generate if they earned a trophy for this exercise
            }));

            setRecordSummary(trophies);

        };

        fetchRecordSummary();
        getUserById(localStorage.getItem("id")).then((response) => {
            console.log('User:', response);
            setUser(response);
        });
        setLoading(false);
    }, [selectedExercices]);

    const handlePostSubmit = () => {
        console.log('Post Title:', postTitle);
        console.log('Post Description:', postDescription);
        console.log('Location:', location);
        console.log('Record Summary:', recordSummary);
        console.log('Session Exercises:', selectedExercices);

        // Post submission logic
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            <h2 style={{ color: '#9b0000', position: "absolute", left: "40px", margin: "20px 0" }}>
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <div className="session-post" style={width < 400 ? { padding: '5px', margin: "80px 0" } : width < 550 ? { padding: '10px', margin: "80px 10px" } : { padding: '20px' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        className="icon-navbar"
                        src={require('../../images/profilepic.webp')}
                        alt='compte'
                        style={{
                            borderRadius: "50%",
                            border: "1px solid black",
                        }}
                    />
                    <div>
                        {user ? <strong>{user.fName} {user.lName}</strong> : <strong>Prénom Nom</strong>}
                        <br />
                        <i>{selectedDate}</i>
                    </div>
                </div>


                {/* Post Title - Editable */}
                <InlineEditable
                    value={postTitle}
                    onChange={setPostTitle}
                    style={{ fontSize: '2rem', marginBottom: "10px" }}
                    autoFocus={true}
                />

                {/* Location - Editable
                <InlineEditable
                    value={location}
                    onChange={setLocation}
                    style={{ fontSize: '1.2rem', marginBottom: '20px' }}
                /> */}

                {/* Post Description - Editable */}
                <InlineEditable
                    value={postDescription}
                    onChange={setPostDescription}
                    style={{ fontSize: '1rem', marginBottom: '20px', textAlign: 'justify', lineHeight: '1.6', backgroundColor: "#f9f4f4" }}
                />

                {/* Session Summary */}
                <div
                    style={{
                        display: 'flex',
                        overflowX: 'auto', // Enable horizontal scrolling
                        scrollSnapType: 'x mandatory', // Snap to each child
                        gap: '20px', // Add some spacing between each "slide"
                        paddingBottom: '20px',
                        scrollbarWidth: 'none', // Hide scrollbar (for modern browsers)
                    }}
                    className="carousel-container"
                >
                    {/* Session Record Summary - First Slide */}
                    {width < 450 ?
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                            <div className="instagramPost" style={width < 500 ? { width: width - 100, height: width - 100 } : {}}>
                                <p><strong>{selectedName}</strong></p>
                                <h3>Résumé des records 1/2</h3>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {recordSummary && recordSummary.slice(0, width < 400 ? 3 : 5).map((record, idx) => (
                                        <li key={record.id}>
                                            <span>{record.exercice} {record.trophies} </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="instagramPost" style={width < 500 ? { width: width - 100, height: width - 100 } : {}}>
                                <h3>Résumé des records 2/2</h3>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {recordSummary && recordSummary.slice(width < 400 ? 3 : 5, recordSummary.length).map((record, idx) => (
                                        <li key={record.id}>
                                            <span>{record.exercice} {record.trophies} </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        :
                        <div className="instagramPost" style={width < 500 ? { width: width - 100, height: width - 100 } : {}}>
                            <p><strong>{selectedName}</strong></p>
                            <h3>Résumé des records</h3>
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {recordSummary && recordSummary.map((record, idx) => (
                                    <li key={record.id}>
                                        <span>{record.exercice} {record.trophies} </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {/* Each Exercise as a Slide */}
                    {selectedExercices.map((exercice, idx) => (
                        <div key={exercice._id} className="instagramPost" style={width < 500 ? { width: width - 100, height: width - 100 } : {}}>
                            <div className="sessionSummaryExercice">
                                <h3>
                                    {exercice.exercice.name.fr}{' '}
                                    {exercice.categories.length > 0 &&
                                        '- ' + exercice.categories.map((category) => category.name.fr).join(', ')}
                                </h3>
                                {exercice.sets && exercice.sets.length > 0 &&
                                    <ul style={{ listStyleType: 'none', padding: 0, textAlign: '-webkit-center' }}>
                                        {renderSets(exercice.sets, "")}
                                    </ul>}
                            </div>
                        </div>
                    ))}
                </div>


                {/* Session Exercises */}

                {/* Submit Button */}
                <button onClick={handlePostSubmit} className="btn btn-black mt-2" style={{ width: '100%' }}>
                    Publier la séance
                </button>
            </div>
        </div >

    );
}

export default SessionPost;
