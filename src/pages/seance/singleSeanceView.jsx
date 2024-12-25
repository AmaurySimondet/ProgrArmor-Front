import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../../utils/API';
import { getUserById } from '../../utils/user';
import { setsToSeance } from '../../utils/sets';
import SessionPostChild from '../session/SessionPostChild';
import Loader from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';

const SingleSeanceView = () => {
    const [searchParams] = useSearchParams();
    const [seance, setSeance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeanceData = async () => {
            try {
                const seanceId = searchParams.get('id');
                if (!seanceId) {
                    throw new Error('No seance ID provided');
                }

                // Fetch seance data
                const seanceResponse = await API.getSeanceSets({ seanceId });
                const seanceSets = seanceResponse.data.sets;

                // Get the seance details
                const seanceDetailsResponse = await API.getSeance({ id: seanceId });
                const seanceDetails = seanceDetailsResponse.data.seance;

                // Get user data
                const userData = await getUserById(seanceDetails.user);

                // Transform seance sets
                const transformedSeance = await setsToSeance(seanceSets);

                setSeance({
                    _id: seanceId,
                    user: userData,
                    title: seanceDetails.title || "N/A",
                    description: seanceDetails.description,
                    name: seanceDetails.name,
                    date: seanceDetails.date,
                    exercices: transformedSeance.exercices,
                    stats: seanceDetails.stats,
                    recordSummary: seanceDetails.recordSummary || [],
                    seancePhotos: seanceDetails.seancePhotos || []
                });
            } catch (error) {
                console.error('Error fetching seance:', error);
                setError('Failed to load seance');
            } finally {
                setLoading(false);
            }
        };

        fetchSeanceData();
    }, [searchParams]);

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;
    if (!seance) return <div>Seance not found</div>;

    const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

    return (
        <div className="page-container">
            <NavigBar location="seance" />
            <div className="content-wrap">
                <div className="session-post" style={{ padding: '20px', margin: '20px auto', maxWidth: '800px' }}>
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
                        backgroundColors={backgroundColors}
                        editable={false}
                        seancePhotos={seance.seancePhotos}
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SingleSeanceView;