import { React, useState, useEffect } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import { COLORS } from "../../utils/colors";
import Loader from "../../components/Loader";
import { useWindowDimensions } from "../../utils/useEffect";
import { formatDate } from "../../utils/dates";
import { getUserById } from "../../utils/user";
import API from "../../utils/API";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                getUserById(localStorage.getItem('id')).then(setUser);
                const response = await API.getNotifications({
                    userId: localStorage.getItem('id')
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'follow':
                return 'vous suit maintenant';
            case 'like':
                return 'a aimé votre séance';
            case 'comment':
                return 'a commenté votre séance';
            default:
                return 'a interagi avec votre profil';
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark notification as read when clicked
        if (!notification.read) {
            try {
                await API.markNotificationAsRead({
                    notificationId: notification._id
                });

                // Update local state to show notification as read
                setNotifications(prevNotifications =>
                    prevNotifications.map(n =>
                        n._id === notification._id ? { ...n, read: true } : n
                    )
                );
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }

        // Navigate to user profile
        window.location.href = `/compte?id=${notification.fromUser._id}`;
    };

    if (loading) return <Loader />;

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="notifications" />

                <div className="content-wrap popInElement">
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h1 style={{ textAlign: 'center', margin: '20px 0' }}>Tes stalkers préférés</h1>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px' }}>
                            {notifications.length > 0 ? (
                                notifications.map(notification => {
                                    const fromUser = notification.fromUser;
                                    return (
                                        <div
                                            key={notification._id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '15px',
                                                backgroundColor: notification.read ? '#f5f5f5' : 'white',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <img
                                                src={fromUser?.profilePic || require('../../images/profilepic.webp')}
                                                alt="Profile"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%',
                                                    marginRight: '15px'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                                    <span style={{ fontWeight: 'bold' }}>
                                                        {fromUser?.fName} {fromUser?.lName}
                                                    </span>
                                                    {' '}
                                                    {getNotificationText(notification)}
                                                </div>
                                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                                    {formatDate(notification.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    Aucune notification
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Notifications;
