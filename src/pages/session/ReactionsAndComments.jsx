import React, { useState, useEffect } from 'react';
import API from '../../utils/API';
import { MiniLoader } from '../../components/Loader';
import { COLORS, REACTIONS } from '../../utils/constants';

function ReactionsAndComments({ seanceUser, seanceId, displayComments, setShowReactions, setReactions }) {
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [allReactions, setAllReactions] = useState([]);
    const [selectedReaction, setSelectedReaction] = useState(null);
    const [topReactions, setTopReactions] = useState([]);
    const [totalReactions, setTotalReactions] = useState(0);
    const [commentData, setCommentData] = useState({
        topComment: null,
        totalComments: 0,
        hasUserCommented: false
    });
    const [loading, setLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        loadReactionsAndComments();
    }, [seanceId]);

    const loadReactionsAndComments = async () => {
        try {
            setLoading(true);
            // Get reactions
            const reactionRes = await API.getSeanceReactions(seanceId);
            if (reactionRes.data.success) {
                setAllReactions(reactionRes.data.reactions);
                setTotalReactions(reactionRes.data.reactions.length);
                setTopReactions(reactionRes.data.topReactions);
                setSelectedReaction(reactionRes.data.userReaction?.reaction);
            }

            // Get comments
            const commentRes = await API.getSeanceComments(seanceId);
            if (commentRes.data.success) {
                setCommentData({
                    topComment: commentRes.data.topComment,
                    totalComments: commentRes.data.totalComments,
                    hasUserCommented: commentRes.data.hasUserCommented
                });
            }
        } catch (error) {
            console.error('Error loading reactions and comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReactionClick = async (reaction) => {
        try {
            const newReaction = selectedReaction === reaction ? null : reaction;
            const response = await API.updateSeanceReaction(seanceId, newReaction, null, seanceUser._id);

            await loadReactionsAndComments();
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
        setShowReactionPicker(false);
    };

    if (loading) {
        return <MiniLoader />
    }

    return (
        <div>
            {/* Top Comment Section */}
            {commentData.topComment?.comment && !displayComments && (
                <div style={{
                    padding: '10px',
                    marginBottom: '10px',
                    borderBottom: '1px solid #eee',
                    fontSize: '0.9em',
                    color: '#666'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        marginBottom: '3px'
                    }}>
                        <span style={{ fontWeight: 'bold' }} className='clickable' onClick={() => {
                            window.location.href = `/compte?id=${commentData.topComment.comment.user._id}`;
                        }}>{commentData.topComment.comment.user.fName} {commentData.topComment.comment.user.lName}</span>
                        <span style={{ fontSize: '0.8em' }}>• {commentData.topComment.reactions?.length || 0} reaction{commentData.topComment.reactions?.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className='clickable' onClick={() => {
                        window.location.href = `/seance?id=${seanceId}`;
                    }}>{commentData.topComment.comment.text}</div>
                </div>
            )}

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '40px',
                paddingTop: '10px',
                justifyContent: 'center'
            }}>

                {/* Reactions */}
                <div style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <button
                            className="btn btn-white"
                            onClick={() => setShowReactionPicker(!showReactionPicker)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                backgroundColor: selectedReaction ? COLORS.ReactionColor : 'white'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                {selectedReaction || '👍'}
                            </div>
                        </button>

                        {/* Show reaction counts inline */}
                        {topReactions.length > 0 && (
                            <span style={{ fontSize: '0.9em' }} className='clickable'
                                onClick={() => {
                                    setReactions(allReactions);
                                    setShowReactions(true)
                                }}
                            >
                                {topReactions} {totalReactions}
                            </span>
                        )}
                    </div>

                    {showReactionPicker && (
                        <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            left: '0',
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            display: 'flex',
                            gap: '10px',
                            zIndex: 1000
                        }}>
                            {REACTIONS.map((reaction) => (
                                <span
                                    key={reaction}
                                    onClick={() => handleReactionClick(reaction)}
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: '20px',
                                        opacity: selectedReaction === reaction ? 1 : 0.7,
                                        padding: '5px',
                                        borderRadius: '100%',
                                        backgroundColor: selectedReaction === reaction ? COLORS.ReactionColor : 'transparent'
                                    }}
                                >
                                    {reaction}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comments */}
                <button
                    className="btn btn-white"
                    onClick={() => {
                        window.location.href = `/seance?id=${seanceId}`;
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: commentData.hasUserCommented ? COLORS.ReactionColor : 'inherit'
                    }}
                >
                    💬
                    {commentData.totalComments > 0 && <span> {commentData.totalComments} </span>}
                </button>
            </div>
        </div>
    );
}

export default ReactionsAndComments;
