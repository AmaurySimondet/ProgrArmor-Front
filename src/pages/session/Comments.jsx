import React, { useState, useEffect } from 'react';
import API from '../../utils/API';

const REACTIONS = ['👍', '❤️', '💪', '👏', '😂'];

function Comments({ seanceUser, seanceId, setShowReactions, setReactions }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showReactionPicker, setShowReactionPicker] = useState(null); // Stores comment ID

    useEffect(() => {
        loadComments();
    }, [seanceId]);

    const loadComments = async () => {
        try {
            const response = await API.getSeanceComments(seanceId);
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await API.postSeanceComment(seanceId, newComment.trim(), seanceUser._id);
            if (response.data.success) {
                setComments(response.data.comments);
                setNewComment('');
                await loadComments(); // Reload comments after posting to ensure we have latest data
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    const handleReactionClick = async (commentId, reaction) => {
        try {
            // If clicking the same reaction, send null to remove it
            const newReaction = reaction === comments.find(c => c.comment._id === commentId)?.userReaction?.reaction ? null : reaction;
            const response = await API.updateSeanceReaction(seanceId, newReaction, commentId);

            if (response.data.success) {
                setComments(prev =>
                    prev.map(comment =>
                        comment.comment._id === commentId
                            ? {
                                ...comment,
                                reactions: response.data.reactions,
                                userReaction: response.data.userReaction,
                                topReactions: response.data.topReactions
                            }
                            : comment
                    )
                );
            }
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
        setShowReactionPicker(null);
    };

    return (
        <div className="comments-container" style={{ padding: '20px' }}>
            {/* Comments List */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginBottom: '20px'
            }}>
                {comments?.length > 0 && comments
                    .sort((a, b) => (b.reactions?.length || 0) - (a.reactions?.length || 0))
                    .map(comment => {
                        return (
                            <div
                                key={comment.comment._id}
                                className='popInElement'
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#f8f9fa',
                                    position: 'relative'
                                }}
                            >
                                {/* Author Info */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '8px'
                                }}
                                    className='clickable'
                                    onClick={() => {
                                        window.location.href = `/compte?id=${comment.comment.user._id}`;
                                    }}>
                                    <img
                                        src={comment.comment.user.profilePic ? comment.comment.user.profilePic : require('../../images/profilepic.webp')}
                                        alt=""
                                        style={{
                                            borderRadius: '50%',
                                            border: '1px solid white'
                                        }}
                                        className='icon-navbar'
                                    />
                                    <strong>{comment.comment.user.fName} {comment.comment.user.lName}</strong>
                                    <span style={{ color: '#666', fontSize: '0.9em' }}>
                                        {new Date(comment.comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Comment Text */}
                                <p style={{ margin: '0 0 10px 0' }}>{comment.comment.text}</p>

                                {/* Reactions */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button
                                        className="btn btn-white"
                                        onClick={() => setShowReactionPicker(showReactionPicker === comment.comment._id ? null : comment.comment._id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            backgroundColor: comment.userReaction ? '#FFD580' : 'white'
                                        }}
                                    >
                                        {comment.userReaction?.reaction || '👍'}
                                    </button>

                                    {/* Reaction counts */}
                                    {comment.reactions && comment.reactions.length > 0 && (
                                        <span style={{ fontSize: '0.9em' }} onClick={() => {
                                            setShowReactions(true);
                                            setReactions(comment.reactions);
                                        }}>
                                            {comment.topReactions} {comment.reactions.length}
                                        </span>
                                    )}

                                    {/* Reaction Picker */}
                                    {showReactionPicker === comment.comment._id && (
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
                                                    onClick={() => handleReactionClick(comment.comment._id, reaction)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        fontSize: '20px',
                                                        opacity: comment.userReaction?.reaction === reaction ? 1 : 0.7,
                                                        padding: '5px',
                                                        borderRadius: '100%',
                                                        backgroundColor: comment.userReaction?.reaction === reaction ? '#FFD580' : 'transparent'
                                                    }}
                                                >
                                                    {reaction}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
            </div>

            {/* Comment Input */}
            <div style={{
                display: 'flex',
                gap: '10px',
                position: 'sticky', // Optional: make input stick to bottom
                bottom: 0,
                backgroundColor: 'white',
                paddingTop: '10px'
            }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Que dire..."
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                    }}
                />
                <button
                    onClick={handlePostComment}
                    className="btn btn-dark"
                    disabled={!newComment.trim()}
                >
                    Poster
                </button>
            </div>
        </div>
    );
}

export default Comments; 