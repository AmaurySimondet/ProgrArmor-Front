import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SessionPostChild from '../session/SessionPostChild';
import { Loader } from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { fetchSeanceData } from '../../utils/seance';
import { COLORS } from '../../utils/colors';
import { useWindowDimensions } from '../../utils/useEffect';

const SingleSeanceView = () => {
    const [searchParams] = useSearchParams();
    const [seance, setSeance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { width } = useWindowDimensions();

    useEffect(() => {
        fetchSeanceData(searchParams.get('id')).then(setSeance).catch(setError).finally(() => setLoading(false));
    }, [searchParams]);

    if (loading) return <Loader />;
    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="seance" />
                <div className="content-wrap" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                    <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                        <div
                            className="session-post"
                            style={
                                width < 400 ? { padding: '5px', margin: "20px 0 0 0" } :
                                    width < 550 ? { padding: '10px', margin: "20px 10px 0 10px" } :
                                        { padding: '20px', margin: "20px 20px 0 20px" }
                            }
                        >
                            {error ? (
                                <div>Oups ! Une erreur s'est produite... Notre hamster qui fait tourner le serveur doit faire une sieste 🐹</div>
                            ) : !seance ? (
                                <div>404 - Cette séance s'est évaporée comme mes bonnes résolutions de janvier ! 🏃‍♂️💨</div>
                            ) : (
                                <SessionPostChild
                                    seanceId={seance._id}
                                    user={seance.user}
                                    postTitle={seance.title}
                                    postDescription={seance.description}
                                    selectedName={seance.name}
                                    selectedExercices={seance.exercices}
                                    recordSummary={seance.recordSummary}
                                    selectedDate={seance.date}
                                    stats={seance.stats}
                                    backgroundColors={COLORS.backgroundColors}
                                    editable={false}
                                    seancePhotos={seance.seancePhotos}
                                    displayComments={true}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};


export default SingleSeanceView;