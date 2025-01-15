import { React, useState, useEffect } from "react";
import API from "../../utils/API";
import { Loader } from "../../components/Loader";
import ProfilePic from "../../components/profilePic";

const Followers = ({ user, title, dataKey }) => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFollowers = async () => {
            setLoading(true);
            const followerProfiles = [];
            for (const followerId of user[dataKey]) {
                try {
                    const { data } = await API.getUser({ id: followerId });
                    followerProfiles.push(data.profile);
                } catch (error) {
                    console.error("Error fetching follower:", error);
                }
            }
            setFollowers(followerProfiles);
            setLoading(false);
        };

        fetchFollowers();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ textAlign: 'center' }}>{title} {user.fName} {user.lName}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {followers.map(follower => (
                    <div key={follower._id} style={{ display: 'flex', alignItems: 'center', margin: '20px', gap: '20px' }}>
                        <ProfilePic user={follower} size="100px" onClick={() => {
                            window.location.href = `/compte?id=${follower._id}`;
                        }} />
                        <h2 className="clickable" style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/compte?id=${follower._id}`}>{follower?.fName} {follower?.lName}</h2>
                    </div>
                ))}
            </div>
        </div >
    );
};


export default Followers;
