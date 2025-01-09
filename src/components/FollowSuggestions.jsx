import React, { useEffect, useState, useRef, useCallback } from "react";
import { useWindowDimensions } from "../utils/useEffect";
import { Loader } from "./Loader";
import API from "../utils/API";

const USERS_PER_PAGE = 10;

const FollowSuggestions = ({ userId }) => {
    const { width } = useWindowDimensions();
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [followingInProgress, setFollowingInProgress] = useState([]);
    const observer = useRef();

    // Last element callback for intersection observer
    const lastUserElementRef = useCallback(node => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    // Update the useEffect to handle pagination
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await API.getUsers({
                    page: page,
                    limit: USERS_PER_PAGE
                });

                setUsers(prev => {
                    const newUsers = response.data.users.filter(newUser =>
                        !prev.some(existingUser => existingUser._id === newUser._id)
                    );
                    return [...prev, ...newUsers];
                });
                setHasMore(response.data.pagination.hasMore);
            } catch (error) {
                console.error("Error fetching users data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (!loading && currentUser) {
            fetchUsers();
        }
    }, [currentUser, page]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.getUser({ id: userId });
                setCurrentUser(response.data.profile);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        // Initial load
        fetchUserData().then(() => {
            setLoading(false);
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
                <h3 style={{ textAlign: "-webkit-center" }}>
                    Suggestions de profils à stalker
                </h3>
                <div className='basic-flex' style={{
                    flexDirection: 'column', gap: '20px', display: 'flex',
                    height: '70px',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    scrollSnapType: 'x mandatory',
                    paddingBottom: '20px',
                    scrollbarWidth: 'none',
                    position: 'relative', // Required for the index positioning
                    maxWidth: '700px',
                    minWidth: '350px',
                }}
                >
                    {users && users.length > 0 ? (
                        users.map((user, index) => (
                            <div
                                ref={index === users.length - 1 ? lastUserElementRef : null}
                                key={user._id}
                                className='basic-flex'
                                style={{ gap: '20px', alignItems: 'center' }}
                            >
                                <img
                                    className="icon-navbar"
                                    src={user?.profilePic ? user?.profilePic : require('../images/profilepic.webp')}
                                    alt='compte'
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = require('../images/profilepic.webp');
                                    }}
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid white",
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
                    {isLoading && <Loader />}
                </div>
            </div>
        </div>
    )
}

export default FollowSuggestions;