import React, { useState, useEffect } from 'react';
import API from '../../utils/API';
import { COLORS, REACTIONS } from '../../utils/constants';
import { getUserById } from '../../utils/user';
import ProfilePic from '../../components/profilePic';

function Comments({ seanceUser, seanceId, setShowReactions, setReactions }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showReactionPicker, setShowReactionPicker] = useState(null); // Stores comment ID
    const [searchResults, setSearchResults] = useState([]);
    const [identifiedUsers, setIdentifiedUsers] = useState([]); // Store mentioned users
    const [mentionMap, setMentionMap] = useState({}); // Format: { "@John Doe": "user_id" }
    const [currentUser, setCurrentUser] = useState(null);
    const [inputInformation, setInputInformation] = useState('');
    const [editCommentId, setEditCommentId] = useState(null);
    const [currentMentionStart, setCurrentMentionStart] = useState(null);
    const [parentComment, setParentComment] = useState(null);
    const [commentReplies, setCommentReplies] = useState({});  // Format: { parentId: [replies] }

    useEffect(() => {
        getUserById(localStorage.getItem('id')).then(setCurrentUser);
    }, []);

    useEffect(() => {
        loadComments();
    }, [seanceId]);

    const loadComments = async () => {
        try {
            const response = await API.getSeanceComments(seanceId);
            if (response.data.success) {
                // Separate comments and replies
                const comments = response.data.comments;
                const mainComments = [];
                const replies = {};

                comments.forEach(comment => {
                    if (comment.comment.parentComment) {
                        const parentId = comment.comment.parentComment;
                        if (!replies[parentId]) replies[parentId] = [];
                        replies[parentId].push(comment);
                    } else {
                        mainComments.push(comment);
                    }
                });

                setComments(mainComments);
                setCommentReplies(replies);
                console.log("commentReplies", replies);
                console.log("comments", mainComments);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    const handleInputChange = async (e) => {
        const value = e.target.value;
        const cursorPosition = e.target.selectionStart;
        setNewComment(value);

        // Find the @ symbol before the cursor
        const textBeforeCursor = value.slice(0, cursorPosition);
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');

        if (lastAtIndex !== -1) {
            const textBetweenAtAndCursor = textBeforeCursor.slice(lastAtIndex + 1);
            // Only search if there are no spaces in the mention text
            if (!textBetweenAtAndCursor.includes(' ')) {
                setCurrentMentionStart(lastAtIndex); // Store the position where the current @ mention starts
                try {
                    const response = await API.getUsers({ search: textBetweenAtAndCursor, limit: 3 });
                    if (response.data.success) {
                        setSearchResults(response.data.users);
                    }
                } catch (error) {
                    console.error('Error searching users:', error);
                }
            } else {
                setSearchResults([]);
                setCurrentMentionStart(null);
            }
        } else {
            setSearchResults([]);
            setCurrentMentionStart(null);
        }

        // Check for deleted mentions and update both mentionMap and identifiedUsers
        const remainingIdentifiedUsers = new Set(identifiedUsers);
        Object.entries(mentionMap).forEach(([mention, userId]) => {
            if (!value.includes(mention)) {
                const newMentionMap = { ...mentionMap };
                delete newMentionMap[mention];
                setMentionMap(newMentionMap);
                remainingIdentifiedUsers.delete(userId);
            }
        });
        setIdentifiedUsers(Array.from(remainingIdentifiedUsers));
    };

    useEffect(() => {
        console.log("identifiedUsers", identifiedUsers);
    }, [identifiedUsers]);

    const handleUserMention = (user) => {
        if (currentMentionStart === null) {
            console.warn('No active mention position found');
            return;
        }

        const mentionText = `@${user.fName} ${user.lName}`;

        // Find the end of the current mention (next space or end of string)
        const textAfterMention = newComment.slice(currentMentionStart);
        const nextSpaceIndex = textAfterMention.indexOf(' ');
        const mentionEnd = nextSpaceIndex !== -1
            ? currentMentionStart + nextSpaceIndex
            : newComment.length;

        // Construct the new comment text by replacing only the current mention
        const newValue =
            newComment.slice(0, currentMentionStart) + // Text before mention
            mentionText + // The mention itself
            (nextSpaceIndex !== -1 ? newComment.slice(mentionEnd) : ' '); // Text after mention

        setNewComment(newValue);

        // Only add to identifiedUsers and mentionMap if not already present
        if (!identifiedUsers.includes(user._id)) {
            setIdentifiedUsers([...identifiedUsers, user._id]);
            setMentionMap({ ...mentionMap, [mentionText]: user._id });
        }
        setSearchResults([]);
        setCurrentMentionStart(null);
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) return;
        if (editCommentId) {
            try {
                const responseComment = await API.updateSeanceComment(seanceId, editCommentId, newComment.trim(), seanceUser._id, identifiedUsers, parentComment);
                await loadComments();
                setEditCommentId(null);
                setNewComment('');
                setIdentifiedUsers([]);
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        } else {
            try {
                const response = await API.postSeanceComment(seanceId, newComment.trim(), seanceUser._id, identifiedUsers, parentComment);
                await loadComments();
                setNewComment('');
                setIdentifiedUsers([]); // Reset identified users
            } catch (error) {
                console.error('Error posting comment:', error);
            }
        };
    };

    const startEditComment = async (commentId) => {
        const foundComment = comments.find(c => c.comment._id === commentId);
        console.log("foundComment", foundComment);
        setEditCommentId(commentId);
        setNewComment(foundComment?.comment.text || '');
        const identifiedUsers = foundComment?.comment.identifiedUsers || [];
        setIdentifiedUsers(identifiedUsers);
        //find the users in the comments
        const users = await Promise.all(identifiedUsers.map(async (user) => {
            const userData = await getUserById(user);
            return userData;
        }));
        const mentionMap = {};
        users.forEach(user => {
            mentionMap[`@${user.fName} ${user.lName}`] = user._id;
        });
        setMentionMap(mentionMap);
        setInputInformation('Modification du commentaire ' + commentId);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await API.deleteSeanceComment(seanceId, commentId);
            await loadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // useEffect(() => {
    //     console.log("editCommentId", editCommentId);
    //     console.log("newComment", newComment);
    //     console.log("identifiedUsers", identifiedUsers);
    //     console.log("mentionMap", mentionMap);
    //     console.log("currentUser", currentUser);
    // }, [editCommentId, newComment, identifiedUsers, mentionMap, currentUser]);

    const handleReactionClick = async (commentId, reaction) => {
        try {
            // If clicking the same reaction, send null to remove it
            const newReaction = reaction === comments.find(c => c.comment._id === commentId)?.userReaction?.reaction ? null : reaction;
            const response = await API.updateSeanceReaction(seanceId, newReaction, commentId);

            await loadComments();
        } catch (error) {
            console.error('Error updating reaction:', error);
        }
        setShowReactionPicker(null);
    };

    const renderCommentText = (text) => {
        const words = text.split(' ');
        const result = [];

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.startsWith('@')) {
                let fullMention = word;
                let j = i + 1;
                let foundMatch = false;

                while (j < words.length && !words[j].startsWith('@')) {
                    const testMention = fullMention + ' ' + words[j];
                    if (currentUser &&
                        testMention.includes(currentUser.fName) &&
                        testMention.includes(currentUser.lName)) {
                        fullMention = testMention;
                        foundMatch = true;
                        break;
                    }
                    fullMention = testMention;
                    j++;
                }

                if (foundMatch) {
                    result.push(
                        <span key={i} style={{
                            backgroundColor: '#FFD580',
                            padding: '0 4px',
                            borderRadius: '4px',
                        }}>
                            {fullMention}
                        </span>
                    );
                    result.push(' ');
                    i = j;
                    continue;
                }
            }
            result.push(word + ' ');
        }
        return result;
    };

    const RenderComment = ({ comment }) => {
        return (
            <div>
                <div
                    key={comment.comment._id}
                    id={comment.comment._id}
                    className='comment'
                    style={{
                        marginLeft: comment.comment.parentComment ? '40px' : '0',
                    }}
                >
                    {/* Add reply indicator for child comments */}
                    {comment.comment.parentComment && (
                        <span style={{ position: 'absolute', left: '-25px' }}>↪️</span>
                    )}
                    {/* Author Info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }} className='clickable' onClick={() => {
                            window.location.href = `/compte?id=${comment.comment.user._id}`;
                        }}>
                            <ProfilePic user={comment.comment.user} size="40px" onClick={() => {
                                window.location.href = `/compte?id=${comment.comment.user._id}`;
                            }} />
                            <strong>{comment.comment.user.fName} {comment.comment.user.lName}</strong>
                            <span style={{ color: '#666', fontSize: '0.9em' }}>
                                {new Date(comment.comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Three Dots Menu */}
                        <div className="dropdown">
                            <img
                                src={require('../../images/icons/three-dots.webp')}
                                alt="options"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    const dropdown = e.currentTarget.nextElementSibling;
                                    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                                }}
                            />
                            <div style={{
                                display: 'none',
                                position: 'absolute',
                                backgroundColor: '#f9f9f9',
                                minWidth: '160px',
                                boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                zIndex: 1,
                                right: 0
                            }}>
                                {comment.comment.user._id === localStorage.getItem('id') ? (
                                    <>
                                        <p style={{ color: 'gray', fontSize: '8px', margin: "5px" }}><i>{comment.comment._id}</i></p>
                                        <a href="#"
                                            className="dropdown-item"
                                            onClick={() => startEditComment(comment.comment._id)}
                                            style={{
                                                color: 'black',
                                                padding: '12px 16px',
                                                textDecoration: 'none',
                                                display: 'block',
                                                transition: 'all 0.5s ease'
                                            }}>Modifier</a>
                                        <a href="#"
                                            className="dropdown-item delete"
                                            onClick={() => handleDeleteComment(comment.comment._id)}
                                            style={{
                                                color: 'red',
                                                padding: '12px 16px',
                                                textDecoration: 'none',
                                                display: 'block',
                                                transition: 'all 0.5s ease'
                                            }}>Supprimer</a>
                                    </>
                                ) : (
                                    <>
                                        <p style={{ color: 'gray', fontSize: '8px', margin: "5px" }}><i>{comment.comment._id}</i></p>
                                        <p style={{
                                            padding: '12px 16px',
                                            margin: 0,
                                            color: 'gray'
                                        }}>Pas d'options pour le moment</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comment Text */}
                    <p style={{ margin: '0 0 10px 0' }}>
                        {renderCommentText(comment.comment.text)}
                    </p>

                    {/* Reactions and answer */}
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

                        {/* Answer */}
                        <button className="btn btn-white" onClick={() => {
                            if (comment.comment.parentComment) {
                                // If already a child comment, just mention the user
                                const mentionText = `@${comment.comment.user.fName} ${comment.comment.user.lName} `;
                                setParentComment(comment.comment.parentComment);
                                setNewComment(mentionText);
                                setIdentifiedUsers([comment.comment.user._id]);
                                setMentionMap({ [mentionText.trim()]: comment.comment.user._id });
                                setInputInformation('Répondre à ' + comment.comment.user.fName + ' ' + comment.comment.user.lName + ': "' + comment.comment.text + '"');
                            } else {
                                // If it's a parent comment, allow nesting
                                setNewComment('');
                                setParentComment(comment.comment);
                                setInputInformation('Répondre à ' + comment.comment.user.fName + ' ' + comment.comment.user.lName + ': "' + comment.comment.text + '"');
                            }
                        }}>Répondre</button>
                    </div>
                </div>

                {/* Replies */}
                {commentReplies[comment.comment._id]?.map(reply => (
                    <RenderComment comment={reply} />
                ))}
            </div>
        )
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const commentId = urlParams.get('commentId');

        if (commentId) {
            // Wait for comments to load and DOM to update
            setTimeout(() => {
                const element = document.getElementById(commentId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                    // Optional: add highlight effect
                    element.style.backgroundColor = '#FFE5B4';
                    setTimeout(() => {
                        element.style.backgroundColor = '#f8f9fa';
                        element.style.transition = 'background-color 0.5s ease';
                    }, 2000);
                }
            }, 500);
        }
    }, [comments]); // Run when comments are loaded

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
                    .sort((a, b) => {
                        return (b.reactions?.length || 0) - (a.reactions?.length || 0);
                    })
                    .map(comment => {
                        return (
                            <RenderComment comment={comment} />
                        )
                    })}
            </div>

            {/* Comment Input */}
            <div style={{ position: 'sticky', bottom: 0, backgroundColor: 'white', paddingTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ color: "gray", fontSize: '12px', margin: "5px" }}><i>{inputInformation}</i></p>
                    {inputInformation && (
                        <span
                            onClick={() => {
                                setInputInformation('');
                                setEditCommentId(null);
                                setNewComment('');
                                setIdentifiedUsers([]);
                                setMentionMap({});
                                setParentComment(null);
                            }}
                            style={{
                                cursor: 'pointer',
                                color: COLORS.PROGARMOR,
                                fontSize: '14px',
                                padding: '0 5px'
                            }}
                        >
                            ✕
                        </span>
                    )}
                </div>
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center'
                }}>
                    <p style={{
                        margin: '0',
                        backgroundColor: identifiedUsers.length > 0 ? '#FFD580' : 'white',
                        padding: '5px',
                        borderRadius: '5px',
                        height: '100%'
                    }}> @ {identifiedUsers.length}</p>
                    <div style={{ position: 'relative', flex: 1 }}>
                        {searchResults.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                zIndex: 1000,
                                marginBottom: '5px',
                                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
                            }}>
                                {searchResults.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserMention(user)}
                                        style={{
                                            padding: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            hover: { backgroundColor: '#f5f5f5' }
                                        }}
                                    >
                                        <ProfilePic user={user} size="30px" onClick={() => {
                                            window.location.href = `/compte?id=${user._id}`;
                                        }} />
                                        <span>{user.fName} {user.lName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <textarea
                            value={newComment}
                            onChange={handleInputChange}
                            placeholder="Que dire..."
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ddd',
                                resize: 'vertical',
                                minHeight: '60px'
                            }}
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        className="btn btn-dark"
                        disabled={!newComment.trim()}
                    >
                        {editCommentId ? 'Modifier' : (parentComment ? 'Répondre' : 'Poster')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Comments; 