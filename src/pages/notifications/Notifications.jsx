import { React, useState, useEffect } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import { COLORS } from "../../utils/constants";
import { Loader } from "../../components/Loader";
import { useWindowDimensions } from "../../utils/useEffect";
import { formatDate } from "../../utils/dates";
import { getUserById } from "../../utils/user";
import API from "../../utils/API";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState(null);

    const getNotificationText = (notification) => {
        switch (notification.type) {
            case 'follow':
                return 'te suis maintenant';
            case 'reaction':
                return 'a réagit à ta séance';
            case 'comment':
                return 'a commenté ta séance';
            default:
                return 'a interagi avec ta profil';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                getUserById(localStorage.getItem('id')).then(setUser);
                const response = await API.getNotifications({
                    userId: localStorage.getItem('id')
                });

                // Group and process notifications
                const groupedNotifications = response.data.notifications.reduce((acc, notification) => {
                    if (notification.type === 'follow') {
                        notification.fromUser.notificationName = `${notification.fromUser.fName} ${notification.fromUser.lName} te suis maintenant`;
                        notification.allIds = [notification._id];
                        acc.push(notification);
                    } else {
                        const key = `${notification.type}-${notification.seance}`;
                        if (!acc.find(n => `${n.type}-${n.seance}` === key)) {
                            const sameTypeAndSeance = response.data.notifications.filter(
                                n => n.type === notification.type && n.seance === notification.seance
                            );

                            if (sameTypeAndSeance.length > 1) {
                                const names = `${notification.fromUser.fName} ${notification.fromUser.lName} et ${sameTypeAndSeance.length - 1} autre${sameTypeAndSeance.length - 1 > 1 ? 's' : ''}`
                                notification.fromUser.notificationName = `${names} ${notification.type === 'reaction' ? 'ont réagis à' : 'ont commenté'} ta séance`;
                                // Check if all notifications in group are read
                                notification.read = sameTypeAndSeance.every(n => n.read);
                                notification.allIds = sameTypeAndSeance.map(n => n._id);
                            } else {
                                notification.fromUser.notificationName = `${notification.fromUser.fName} ${notification.fromUser.lName} ${getNotificationText(notification)}`;
                                notification.allIds = [notification._id];
                            }
                            acc.push(notification);
                        }
                    }
                    return acc;
                }, []);

                setNotifications(groupedNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleNotificationClick = async (notification) => {
        // Mark notification as read when clicked
        if (!notification.read) {
            try {
                if (notification.allIds.length > 1) {
                    await API.bulkMarkNotificationAsRead({
                        notificationIds: notification.allIds
                    });

                    // Update local state for all notifications in the group
                    setNotifications(prevNotifications =>
                        prevNotifications.map(n =>
                            notification.allIds.includes(n._id) ? { ...n, read: true } : n
                        )
                    );
                } else {
                    await API.markNotificationAsRead({
                        notificationId: notification._id
                    });

                    // Update local state for single notification
                    setNotifications(prevNotifications =>
                        prevNotifications.map(n =>
                            n._id === notification._id ? { ...n, read: true } : n
                        )
                    );
                }
            } catch (error) {
                console.error("Error marking notification as read:", error);
            }
        }

        // Navigate to user profile
        if (notification.type === 'reaction') {
            window.location.href = `/seance?id=${notification.seance}`;
        } else if (notification.type === 'comment') {
            window.location.href = `/seance?id=${notification.seance}`;
        } else {
            window.location.href = `/compte?id=${notification.fromUser._id}`;
        }
    };

    const handleNotificationDeletion = async (e, notification) => {
        e.stopPropagation(); // Prevent triggering the notification click
        try {
            console.log("Deleting notification:", notification);
            if (notification.allIds.length > 1) {
                await API.bulkDeleteNotifications({
                    notificationIds: notification.allIds
                });
            } else {
                await API.deleteNotification({
                    notificationId: notification._id
                });
            }
            // Remove the notification(s) from local state
            setNotifications(prevNotifications =>
                prevNotifications.filter(n => !notification.allIds.includes(n._id))
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
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
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevent infinite loop
                                                    e.target.src = require('../../images/profilepic.webp');
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                                                    {fromUser?.notificationName}
                                                </div>
                                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                                    {formatDate(notification.createdAt)}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleNotificationDeletion(e, notification)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '8px',
                                                    color: '#666',
                                                    fontSize: '1.2em'
                                                }}
                                            >
                                                🗑️
                                            </button>
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
