import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "../utils/useEffect";
import Loader from "./Loader";
import API from "../utils/API";

const FollowSuggestions = ({ userId }) => {
    const { width } = useWindowDimensions();
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [followingInProgress, setFollowingInProgress] = useState([]);

    useEffect(() => {
        // get user
        const fetchUserData = async () => {
            try {
                const response = await API.getUser({ id: userId });
                setCurrentUser(response.data.profile);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // USERS
        const fetchUsersData = async () => {
            try {
                const response = await API.getUsers();
                setUsers(response.data.users);
            } catch (error) {
                console.error("Error fetching users data:", error);
            }
        };
        fetchUserData().then(() => {
            fetchUsersData().then(() => {
                setLoading(false);
            });
        });
    }, []);

    const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
        if (isCurrentlyFollowing) {
            const confirmUnfollow = window.confirm("Etes vous sur de vouloir ne plus suivre ?");
            if (!confirmUnfollow) return;
        }

        setFollowingInProgress(prev => [...prev, userId]);
        try {
            if (isCurrentlyFollowing) {
                await API.unfollowUser({ userId: localStorage.getItem('id'), unfollowingId: userId });
                setUsers(prevUsers => prevUsers.map(user =>
                    user._id === userId
                        ? { ...user, followers: user.followers.filter(followerId => followerId !== localStorage.getItem('id')) }
                        : user
                ));
                setCurrentUser(prevUser => ({
                    ...prevUser,
                    following: prevUser.following.filter(followingId => followingId !== userId)
                }));
            } else {
                await API.followUser({ userId: localStorage.getItem('id'), followingId: userId });
                setUsers(prevUsers => prevUsers.map(user =>
                    user._id === userId
                        ? { ...user, followers: [...(user.followers || []), localStorage.getItem('id')] }
                        : user
                ));
                setCurrentUser(prevUser => ({
                    ...prevUser,
                    following: [...(prevUser.following || []), userId]
                }));
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
        setFollowingInProgress(prev => prev.filter(id => id !== userId));
    };

    const isFollowing = (user) => {
        return followingInProgress.includes(user._id) || user._id === localStorage.getItem('id') || currentUser?.following?.includes(user._id);
    };

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
                            <div key={user._id} className='basic-flex' style={{ gap: '20px', alignItems: 'center' }}>
                                <img
                                    className="icon-navbar"
                                    src={require('../images/profilepic.webp')}
                                    alt='compte'
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid black",
                                    }}
                                    onClick={() => window.location.href = `/compte?id=${user._id}`}
                                />
                                <div>
                                    <div><a href={`/compte?id=${user._id}`}>
                                        {user.fName} {user.lName} </a> </div>
                                    <button
                                        className={isFollowing(user) ? "btn btn-white" : "btn btn-black"}
                                        onClick={() => handleFollowToggle(user._id, isFollowing(user))}
                                        disabled={followingInProgress.includes(user._id) || user._id === localStorage.getItem('id')}
                                    >
                                        {user._id === localStorage.getItem('id') ? "Ça c'est toi !" : followingInProgress.includes(user._id) ? 'Chargement...' : isFollowing(user) ? 'Ne Plus Suivre' : 'Suivre'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Aucune suggestion pour le moment</div>
                    )}
                </div>
            </div>
        </div >
    )
}

export default FollowSuggestions;