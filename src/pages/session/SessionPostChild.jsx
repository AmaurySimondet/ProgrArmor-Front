import { React, useState } from 'react';
import { InlineEditable } from '../../components/InlineEditable';
import { useWindowDimensions } from '../../utils/useEffect';
import PostStats from './PostStats';
import InstagramCarousel from './InstagramCarousel';
import API from '../../utils/API';

function SessionPostChild({ id, user, postTitle, setPostTitle, postDescription, setPostDescription, selectedName, selectedExercices, recordSummary, selectedDate, stats, backgroundColors, editable }) {
    const { width } = useWindowDimensions();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await API.deleteSeance({ id, user: user.id });
        setIsDeleting(false);
        window.location.href = `/dashboard`;
    };

    return (
        <div>
            {/* User Info and options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                        className="icon-navbar"
                        src={require('../../images/profilepic.webp')}
                        alt='compte'
                        style={{
                            borderRadius: "50%",
                            border: "1px solid black",
                        }}
                        onClick={() => window.location.href = `/compte?id=${user.id}`}
                    />
                    <div>
                        {user ? <strong><a href={`/compte?id=${user.id}`}>{user.fName} {user.lName}</a></strong> : <strong>Prénom Nom</strong>}
                        <br />
                        <i>{selectedDate}</i>
                    </div>
                </div>
                {user?.id === localStorage.getItem('id') && !editable ? (
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
                            <p style={{ color: 'gray', fontSize: '8px', margin: "5px" }}><i>{id}</i></p>
                            <a href={id ? `/session?id=${id}` : `/session`}
                                className="dropdown-item"
                                onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = id ? `/session?id=${id}` : `/session`;
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
                        marginBottom: "10px",
                        height: "40px"
                    }}
                    autoFocus={true}
                    placeholder={"Titre"}
                />
                :
                <h1 style={{ fontSize: width < 500 ? '25px' : '30px', marginBottom: "10px" }}>{postTitle}</h1>
            }


            {/* Post Description - Editable */}
            {editable ?
                <InlineEditable
                    value={postDescription}
                    onChange={setPostDescription}
                    placeholder={"Description (optionnel)"}
                    style={{ fontSize: '1rem', marginBottom: '20px', textAlign: 'justify', lineHeight: '1.6', backgroundColor: "#f9f4f4", height: "125px" }}
                />
                :
                <p style={{ fontSize: '1rem', marginBottom: '20px', textAlign: 'justify', lineHeight: '1.6', backgroundColor: "#f9f4f4" }}>{postDescription}</p>
            }

            {/* Stats */}
            <PostStats stats={stats} />

            {/* Session Summary */}
            <InstagramCarousel selectedName={selectedName} selectedExercices={selectedExercices} recordSummary={recordSummary} backgroundColors={backgroundColors} />
        </div >
    );
}

export default SessionPostChild;