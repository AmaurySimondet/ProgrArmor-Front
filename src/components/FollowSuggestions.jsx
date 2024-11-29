import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../utils/useEffect";
import Loader from "./Loader";
import API from "../utils/API";
const FollowSuggestions = (props) => {
    const { width } = useWindowDimensions();
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // USERS
        const fetchUsersData = async () => {
            try {
                const response = await API.getUsers();
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };
        fetchUsersData().then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <div>
            <div className='basic-flex popInElement' style={{ flexDirection: 'column', alignItems: 'center', padding: width < 400 ? "5px" : width < 550 ? "10px" : "20px" }}>
                <h1 style={{ marginTop: '20px', marginBottom: '20px', textAlign: "-webkit-center" }}>
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
                                    src={require('../images/profilepic.webp')}
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
                        <div>Aucune suggestion pour le moment</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowSuggestions;