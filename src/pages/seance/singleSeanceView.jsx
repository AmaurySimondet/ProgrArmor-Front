import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SessionPostChild from '../session/SessionPostChild';
import Loader from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { fetchSeanceData } from '../../utils/seance';
import { COLORS } from '../../utils/colors';

const SingleSeanceView = () => {
    const [searchParams] = useSearchParams();
    const [seance, setSeance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchSeanceData(searchParams.get('id')).then(setSeance).catch(setError).finally(() => setLoading(false));
    }, [searchParams]);

    if (loading) return <Loader />;
    return (
        <div className="page-container">
            <NavigBar location="seance" />
            <div className="content-wrap">
                <div className="session-post" style={{ padding: '20px', margin: '20px auto', maxWidth: '800px' }}>
                    {error ? (
                        <div>Oups ! Une erreur s'est produite... Notre hamster qui fait tourner le serveur doit faire une sieste 🐹</div>
                    ) : !seance ? (
                        <div>404 - Cette séance s'est évaporée comme mes bonnes résolutions de janvier ! 🏃‍♂️💨</div>
                    ) : (
                        <SessionPostChild
                            id={seance._id}
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
                        />
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default SingleSeanceView;