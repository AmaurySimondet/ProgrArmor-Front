import React, { useState, useEffect } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import Loader from '../../components/Loader';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { COLORS } from '../../utils/colors';
import API from '../../utils/API';
import { fetchSeancesData } from '../../utils/seance';
import DisplaySeancesPost from '../../components/DisplaySeancesPost';

const DashBoard = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [seances, setSeances] = useState(null);
    const [users, setUsers] = useState(null);

    // SEANCES & USERS
    useEffect(() => {
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
                console.log('Users:', response.data.users);
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

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="dashboard" />




                {/* PAGE CONTENT */}
                <div className="content-wrap">

                    {/* USERS */}
                    <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center', padding: width < 400 ? "5px" : width < 550 ? "10px" : "20px" }}>
                        <h1 style={{ marginTop: '40px', marginBottom: '20px', textAlign: "-webkit-center" }}>
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
                                    <div key={user.id} className='basic-flex' style={{ gap: '20px', alignItems: 'center' }}>
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
                                            <div><a href={`/compte?id=${user.id}`}>
                                                {user.fName} {user.lName} </a> </div>
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
                    <DisplaySeancesPost seances={seances} />
                </div>




                <Footer />
            </div>
        </div>
    );
}

export default DashBoard;
