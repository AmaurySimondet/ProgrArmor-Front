import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { COLORS } from '../../utils/colors';
import API from '../../utils/API';
import SessionPostChild from '../session/SessionPostChild';
import { stringToDate } from '../../utils/dates';
import { fetchSeancesData } from '../../utils/seance';

const DashBoard = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState(null);
    const [users, setUsers] = useState(null);

    useEffect(() => {
        // SEANCES
        // wait for fetchSeancesData to complete before setting the loading state to false
        const fetchSeances = async () => {
            const seances = await fetchSeancesData();
            setSeances(seances);
        };
        fetchSeances();

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

    // when users and seances are loaded, set loading to false
    useEffect(() => {
        if (seances && users) {
            setLoading(false);
        }
    }, [seances, users]);

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
                            <div>Aucune séances</div>
                        )}
                    </div>
                </div>




                <Footer />
            </div>
        </div>
    );
}

export default DashBoard;
