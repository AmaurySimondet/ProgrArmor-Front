import { React } from 'react';
import { InlineEditable } from '../../components/InlineEditable';
import { useWindowDimensions } from '../../utils/useEffect';
import PostStats from './PostStats';
import InstagramCarousel from './InstagramCarousel';

function SessionPostChild({ user, postTitle, setPostTitle, postDescription, setPostDescription, selectedName, selectedExercices, recordSummary, selectedDate, stats, backgroundColors, editable }) {
    const { width } = useWindowDimensions();

    return (
        <div>
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