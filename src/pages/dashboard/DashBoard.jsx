import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { COLORS } from '../../utils/colors';
import API from '../../utils/API';
import SessionPostChild from '../session/SessionPostChild';
import { getUserById } from '../../utils/user';
import { setsToSeance } from '../../utils/sets';
import { stringToDate } from '../../utils/dates';

const DashBoard = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        // SEANCES
        const fetchSeancesData = async () => {
            try {
                const response = await API.getSeances();
                const seancesFetched = response.data.seances;

                // Fetch seance sets for all seances
                const seanceSetsPromises = seancesFetched.map(async (seance) => {
                    const seanceSetsResponse = await API.getSeanceSets({ seanceId: seance._id });
                    seance.seanceSets = seanceSetsResponse.data.sets;
                    return seance;
                });

                // Fetch user data for all users in the seances
                const userPromises = seancesFetched.map(async (seance) => {
                    const userResponse = await getUserById(seance.user);
                    seance.user = userResponse;
                    return seance;
                });

                // Wait for all seance sets and user data to be fetched
                await Promise.all([...seanceSetsPromises, ...userPromises]);

                // Transform seanceSets to exercices
                const transformedSeancePromises = seancesFetched.map(async (seance) => {
                    const transformedSeance = await setsToSeance(seance.seanceSets);
                    seance.exercices = transformedSeance.exercices;
                    return seance;
                });

                // Wait for all transformations to complete
                const transformedSeances = await Promise.all(transformedSeancePromises);

                // Update state with the transformed seances
                setSeances(transformedSeances);
            } catch (error) {
                console.error("Error fetching seances data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSeancesData();

        // USERS
        const fetchUsersData = async () => {
            try {
                const response = await API.getUsers();
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };
        fetchUsersData();

    }, []);

    useEffect(() => {
        console.log('Seances:', seances);
    }, [seances]);

    if (loading) {
        return <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="dashboard" />


                <div className="content-wrap">
                    <Loader />
                </div>

                <Footer />
            </div>
        </div>
    }

    const backgroundColors = ["#9C005D", "#9C1B00", "#9B0000", "#8B009C", "#9C3600"];

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="dashboard" />




                {/* PAGE CONTENT */}
                <div className="content-wrap">

                    {/* USERS */}
                    <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center', padding: width < 400 ? "5px" : width < 550 ? "10px" : "20px" }}>
                        <h1 style={{ marginTop: '40px', marginBottom: '20px' }}>
                            Tu connais ces gens?</h1>
                        <div className='basic-flex' style={{
                            flexDirection: 'column', gap: '20px', display: 'flex',
                            height: '70px',
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            scrollSnapType: 'x mandatory',
                            paddingBottom: '20px',
                            scrollbarWidth: 'none',
                            position: 'relative', // Required for the index positioning
                            maxWidth: '600px',
                        }}>
                            {users && users.length > 0 ? (
                                users.map((user, index) => (
                                    <div key={user._id} className='basic-flex' style={{ gap: '20px', alignItems: 'center' }}>
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
                                            <div>{user.fName} {user.lName}</div>
                                            <button className="btn btn-black">Suivre</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>No users available</div>
                            )}
                        </div>
                    </div>

                    {/* SEANCES */}
                    <div className='basic-flex popInElement' style={{ flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
                        {seances && seances.length > 0 ? (
                            seances.map((seance, index) => (
                                <div className="session-post" style={
                                    width < 400 ? { padding: '5px', margin: "20px 0 0 0" } :
                                        width < 550 ? { padding: '10px', margin: "20px 10px 0 10px" } :
                                            { padding: '20px', margin: "20px 20px 0 20px" }}>
                                    <SessionPostChild
                                        key={seance._id} // Always provide a key when rendering lists
                                        user={seance.user}
                                        postTitle={seance.title ? seance.title : "N/A"}
                                        postDescription={seance.description}
                                        selectedName={seance.name}
                                        selectedDate={stringToDate(seance.date)}
                                        selectedExercices={seance.exercices}
                                        stats={seance.stats ? seance.stats : { nSets: "N/A", nReps: "N/A", intervalReps: "N/A", totalWeight: "N/A", intervalWeight: "N/A" }}
                                        backgroundColors={backgroundColors}
                                        recordSummary={seance.recordSummary ? seance.recordSummary : []}
                                        editable={false}
                                    />
                                </div>
                            ))
                        ) : (
                            <div>No seances available</div>
                        )}
                    </div>
                </div>




                <Footer />
            </div>
        </div>
    );
}

export default DashBoard;
