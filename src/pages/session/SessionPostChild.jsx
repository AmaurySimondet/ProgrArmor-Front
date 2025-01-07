import { React, useState, useEffect } from 'react';
import { InlineEditable } from '../../components/InlineEditable';
import { useWindowDimensions } from '../../utils/useEffect';
import PostStats from './PostStats';
import InstagramCarousel from './InstagramCarousel';
import API from '../../utils/API';
import { getDetailedDate } from '../../utils/dates';
import ReactionsAndComments from './ReactionsAndComments';
import Comments from './Comments';
import DisplayReactions from '../../components/DisplayReactions';

function SessionPostChild({ seanceId, user, postTitle, setPostTitle, postDescription, setPostDescription, selectedName, selectedExercices, recordSummary, selectedDate, stats, backgroundColors, editable, seancePhotos, displayComments }) {
    const { width } = useWindowDimensions();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [reactions, setReactions] = useState([]);

    const handleDelete = async () => {
        setIsDeleting(true);
        await API.deleteSeance({ id, user: user._id });
        setIsDeleting(false);
        window.location.href = `/dashboard`;
    };

    const handleShare = async () => {
        try {
            const baseText = `Découvrez la séance "${postTitle}" de ${user?.fName} ${user?.lName} sur ProgArmor ! 💪\n`
            if (window.navigator.share) {
                // Use native share on mobile devices that support it (including iOS)
                await window.navigator.share({
                    title: `${baseText}`,
                    url: `${window.location.origin}/seance?id=${seanceId}`
                });
            } else {
                // Fallback for desktop or devices without share API
                const textArea = document.createElement('textarea');
                textArea.value = `${baseText}\n${window.location.origin}/seance?id=${seanceId}`;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                const button = document.querySelector('.share-btn');
                const currentButton = button.cloneNode(true);
                button.style.backgroundColor = '#4CAF50';  // Green color
                button.innerHTML = width > 700 ? 'Copié !' : '✓';

                // Reset button after 2 seconds
                setTimeout(() => {
                    button.style.backgroundColor = '';
                    button.innerHTML = currentButton.innerHTML;
                }, 2000);
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div>
            {/* User Info and options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        className="icon-navbar"
                        src={user?.profilePic ? user?.profilePic : require('../../images/profilepic.webp')}
                        alt='compte'
                        style={{
                            borderRadius: "50%",
                            border: "1px solid white",
                        }}
                        onClick={() => window.location.href = `/compte?id=${user._id}`}
                    />
                    <div>
                        {user ? <strong><a href={`/compte?id=${user._id}`}>{user.fName} {user.lName}</a></strong> : <strong>Prénom Nom</strong>}
                        <br />
                        <i style={{ fontSize: '12px' }}>{selectedName} - {getDetailedDate(selectedDate)}</i>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className="btn btn-white share-btn"
                        onClick={handleShare}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px' }}
                    >
                        <img
                            src={require('../../images/icons/share.webp')}
                            alt="share"
                            style={{
                                width: '20px',
                                height: '20px',
                                transition: 'filter 0.2s'
                            }}
                        />
                        {width > 700 ? 'Partager' : null}
                    </button>
                    {user?._id === localStorage.getItem('id') && !editable ? (
                        <div className="dropdown">
                            <img
                                src={require('../../images/icons/three-dots.webp')}
                                alt="options"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    const dropdown = e.currentTarget.nextElementSibling;
                                    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                                }}
                            />
                            <div style={{
                                display: 'none',
                                position: 'absolute',
                                backgroundColor: '#f9f9f9',
                                minWidth: '160px',
                                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                zIndex: 1,
                                right: 0
                            }}>
                                <p style={{ color: 'gray', fontSize: '8px', margin: "5px" }}><i>{seanceId}</i></p>
                                <a href={seanceId ? `/session?id=${seanceId}` : `/session`}
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.location.href = seanceId ? `/session?id=${seanceId}` : `/session`;
                                    }}
                                    style={{
                                        color: 'black',
                                        padding: '12px 16px',
                                        textDecoration: 'none',
                                        display: 'block',
                                        transition: 'all 0.5s ease'
                                    }}>Modifier</a>
                                <a href="#"
                                    className="dropdown-item delete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowDeleteConfirm(true);
                                    }}
                                    style={{
                                        color: 'red',
                                        padding: '12px 16px',
                                        textDecoration: 'none',
                                        display: 'block',
                                        transition: 'all 0.5s ease'
                                    }}>Supprimer</a>
                            </div>
                        </div>
                    ) : !editable ? (
                        <div className="dropdown">
                            <img
                                src={require('../../images/icons/three-dots.webp')}
                                alt="options"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    const dropdown = e.currentTarget.nextElementSibling;
                                    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                                }}
                            />
                            <div style={{
                                display: 'none',
                                position: 'absolute',
                                backgroundColor: '#f9f9f9',
                                minWidth: '200px',
                                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                zIndex: 1,
                                right: 0
                            }}>
                                <p style={{ color: 'gray', fontSize: '8px', margin: "5px" }}><i>{seanceId}</i></p>
                                <a href="#"
                                    // className="dropdown-item" 
                                    style={{
                                        color: 'black',
                                        padding: '12px 16px',
                                        textDecoration: 'none',
                                        display: 'block',
                                        transition: 'all 0.5s ease'
                                    }}>Pas d'options pour le moment</a>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div
                    onMouseEnter={() => setShowDeleteConfirm(true)}
                    onMouseLeave={() => setShowDeleteConfirm(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        borderRadius: '20px',
                        overflow: 'hidden'
                    }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        maxWidth: '400px',
                        width: '90%'
                    }}>
                        <p>Etes vous sur de vouloir supprimer la seance {selectedName} du {selectedDate} ?</p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px',
                            marginTop: '20px'
                        }}>
                            <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">Annuler</button>
                            <button
                                onClick={handleDelete}
                                className="btn btn-danger"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Suppression..." : "Supprimer"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Banner if the postTitle is N/A */}
            {/* SI le postTitle est N/A, affichier une banniere rouge expliquant que la seance provient de la version pré alpha et manque de données */}
            {postTitle === "N/A" &&
                <div style={{ backgroundColor: "#f9f4f4", padding: "10px", marginTop: "10px", marginBottom: "10px", borderRadius: "5px" }}>
                    <strong style={{ color: "red" }}>Attention:</strong> Cette séance provient de la version pré-alpha de ProgArmor et manque donc de données.
                </div>
            }


            {/* Post Title - Editable */}
            {editable ?
                <InlineEditable
                    value={postTitle}
                    onChange={setPostTitle}
                    style={{
                        fontSize: width < 500 ? '25px' : '30px',
                        marginBottom: "5px",
                        marginTop: "10px",
                        height: "40px"
                    }}
                    autoFocus={true}
                    placeholder={"Titre"}
                />
                :
                <h1
                    style={{
                        fontSize: width < 500 ? '25px' : '30px',
                        marginBottom: "5px",
                        marginTop: "10px",
                        cursor: 'pointer'
                    }}
                    className="clickable"
                    onClick={() => window.location.href = `/seance?id=${seanceId}`}
                >
                    {postTitle}
                </h1>
            }


            {/* Post Description - Editable */}
            {editable ?
                <InlineEditable
                    value={postDescription}
                    onChange={setPostDescription}
                    onKeyDown={(e) => {
                        // Handle Enter key
                        if (e.key === "Enter") {
                            e.preventDefault(); // Prevent default behavior
                            setPostDescription((prev) => prev + "\n"); // Append a new line
                        }
                    }}
                    placeholder={"Description (optionnel)"}
                    style={{ fontSize: '1rem', marginBottom: "0px", textAlign: 'justify', lineHeight: '1.6', backgroundColor: "#f9f4f4", height: "100px", padding: "10px", borderRadius: "5px" }}
                />
                : postDescription ?
                    <p style={{ fontSize: '1rem', marginBottom: "0px", textAlign: 'justify', lineHeight: '1.6', backgroundColor: "#f9f4f4", padding: "10px", borderRadius: "5px" }}>{postDescription}</p>
                    : null
            }

            {/* Stats */}
            <PostStats recordSummary={recordSummary} stats={stats} width={width} />

            {/* Session Summary */}
            <InstagramCarousel seanceId={seanceId} selectedName={selectedName} selectedExercices={selectedExercices} backgroundColors={backgroundColors} editable={editable} selectedDate={selectedDate} seancePhotos={seancePhotos} />

            {/* Reactions / Comments  */}
            {!editable && <ReactionsAndComments seanceUser={user} seanceId={seanceId} displayComments={displayComments} setShowReactions={setShowReactions} setReactions={setReactions} />}

            {/* Comments */}
            {displayComments && <Comments seanceUser={user} seanceId={seanceId} setShowReactions={setShowReactions} setReactions={setReactions} />}

            {/* Display Reactions */}
            {showReactions && <DisplayReactions showReactions={showReactions} currentUser={user} reactions={reactions} setShowReactions={setShowReactions} />}
        </div >
    );
}

export default SessionPostChild;