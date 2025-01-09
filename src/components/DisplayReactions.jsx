import React, { useState, useEffect } from 'react';
import API from '../utils/API';
import { getUserById } from '../utils/user';
import { MiniLoader } from './Loader';

const DisplayReactions = ({ showReactions, setShowReactions, reactions, currentUser }) => {
    const [followingInProgress, setFollowingInProgress] = useState([]);
    const [reactionsWithUserInfo, setReactionsWithUserInfo] = useState(null);
    const [selectedReactionFilter, setSelectedReactionFilter] = useState(null);
    const [reactionCounts, setReactionCounts] = useState({});
    const [filteredReactions, setFilteredReactions] = useState([]);

    useEffect(() => {
        const addUserInfo = async () => {
            const updatedReactions = await Promise.all(
                reactions.map(async (reaction) => {
                    const userInfo = await getUserById(reaction.user);
                    return { ...reaction, user: userInfo };
                })
            );
            setReactionsWithUserInfo(updatedReactions);
        };
        addUserInfo();
    }, [reactions]);

    useEffect(() => {
        console.log("REACTIONS WITH USER INFO", reactionsWithUserInfo);
    }, [reactionsWithUserInfo]);

    const handleFollowToggle = async (userId, isCurrentlyFollowing) => {
        if (isCurrentlyFollowing) {
            const confirmUnfollow = window.confirm("Etes vous sur de vouloir ne plus suivre ?");
            if (!confirmUnfollow) return;
        }

        setFollowingInProgress(prev => [...prev, userId]);
        try {
            if (isCurrentlyFollowing) {
                await API.unfollowUser({ userId: localStorage.getItem('id'), unfollowingId: userId });
            } else {
                await API.followUser({ userId: localStorage.getItem('id'), followingId: userId });
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
        }
        setFollowingInProgress(prev => prev.filter(id => id !== userId));
    };

    const isFollowing = (user) => {
        return followingInProgress.includes(user._id) ||
            user._id === localStorage.getItem('id') ||
            currentUser?.following?.includes(user._id);
    };

    if (!showReactions) return null;

    useEffect(() => {
        if (!reactionsWithUserInfo) return;

        // Calculate reaction counts
        const counts = reactionsWithUserInfo.reduce((acc, reaction) => {
            acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1;
            return acc;
        }, {});
        setReactionCounts(counts);

        // Filter reactions based on selected filter
        const filtered = selectedReactionFilter
            ? reactionsWithUserInfo.filter(reaction => reaction.reaction === selectedReactionFilter)
            : reactionsWithUserInfo;
        setFilteredReactions(filtered);

    }, [reactionsWithUserInfo, selectedReactionFilter]);

    return (
        <div
            onMouseEnter={() => setShowReactions(true)}
            onMouseLeave={() => setShowReactions(false)}
            id="display-reactions"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
                borderRadius: '20px',
                overflow: 'hidden'
            }}>
            {!reactionsWithUserInfo ? (
                <MiniLoader />
            ) : (
                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    maxWidth: '400px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Réactions</h3>
                        <button
                            onClick={() => setShowReactions(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        {Object.entries(reactionCounts).map(([reaction, count]) => (
                            <span
                                key={reaction}
                                style={{
                                    marginRight: '15px',
                                    cursor: 'pointer',
                                    fontWeight: selectedReactionFilter === reaction ? 'bold' : 'normal',
                                    textDecoration: selectedReactionFilter === reaction ? 'underline' : 'none'
                                }}
                                onClick={() => setSelectedReactionFilter(selectedReactionFilter === reaction ? null : reaction)}
                            >
                                {reaction}: {count}
                            </span>
                        ))}
                    </div>
                    {filteredReactions.length > 0 ? (
                        filteredReactions.map((reaction) => (
                            <div
                                key={reaction._id}
                                className='basic-flex'
                                style={{
                                    gap: '20px',
                                    alignItems: 'center',
                                    marginBottom: '15px'
                                }}
                            >
                                <img
                                    className="icon-navbar"
                                    src={reaction.user?.profilePic ? reaction.user.profilePic : require('../images/profilepic.webp')}
                                    alt='compte'
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid white",
                                        width: '40px',
                                        height: '40px'
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite loop
                                        e.target.src = require('../images/profilepic.webp');
                                    }}
                                    onClick={() => window.location.href = `/compte?id=${reaction.user._id}`}
                                />
                                <div style={{ flex: 1 }}>
                                    <div>
                                        <a href={`/compte?id=${reaction.user._id}`}>
                                            {reaction.user.fName} {reaction.user.lName}
                                        </a>
                                    </div>
                                    <button
                                        className={isFollowing(reaction.user) ? "btn btn-white" : "btn btn-black"}
                                        onClick={() => handleFollowToggle(reaction.user._id, isFollowing(reaction.user))}
                                        disabled={followingInProgress.includes(reaction.user._id) || reaction.user._id === localStorage.getItem('id')}
                                    >
                                        {reaction.user._id === localStorage.getItem('id')
                                            ? "Ça c'est toi !"
                                            : followingInProgress.includes(reaction.user._id)
                                                ? 'Chargement...'
                                                : isFollowing(reaction.user)
                                                    ? 'Ne Plus Suivre'
                                                    : 'Suivre'}
                                    </button>
                                </div>
                                <div style={{ marginLeft: 'auto' }}>
                                    {reaction.reaction}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Aucune réaction pour le moment</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DisplayReactions; 