import React from 'react';

const ProfilePic = ({ user, imageUploading, onClick, size = "100px" }) => {
    return (
        <img
            className="icon-navbar"
            src={user?.profilePic ? user?.profilePic : require('../images/profilepic.webp')}
            alt='compte'
            onError={(e) => {
                e.target.onerror = null;
                e.target.src = require('../images/profilepic.webp');
                console.log("Image load error:", e);
            }}
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
            style={{
                borderRadius: "50%",
                border: "1px solid white",
                width: size,
                height: size,
                opacity: imageUploading ? 0.5 : 1,
                cursor: onClick ? 'pointer' : 'default'
            }}
            onClick={onClick}
        />
    );
};

export default ProfilePic;
