import { React, useState, useEffect } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import { COLORS } from "../../utils/colors";
import Loader from "../../components/Loader";
import { useWindowDimensions } from "../../utils/useEffect";
import { formatDate } from "../../utils/dates";
import { getUserById } from "../../utils/user";

function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [notificationUsers, setNotificationUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const { width } = useWindowDimensions();
    const [user, setUser] = useState(null);

    // Fake API call for notifications
    const fakeGetNotifications = async () => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            data: {
                notifications: [
                    {
                        _id: '1',
                        type: 'follow',
                        fromUser: "6365489f44d4b4000470882b",
                        forUser: "669f552741728ab8cfcd4b72",
                        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                        read: false
                    },
                    {
                        _id: '2',
                        type: 'like',
                        fromUser: "63650f0a730196141891cd3a",
                        forUser: "669f552741728ab8cfcd4b72",
                        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                        read: true
                    },
                    {
                        _id: '3',
                        type: 'comment',
                        fromUser: "669f552741728ab8cfcd4b72",
                        forUser: "669f552741728ab8cfcd4b72",
                        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                        read: false
                    }
                ]
            }
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                getUserById(localStorage.getItem('id')).then(setUser);
                const response = await fakeGetNotifications();
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchNotificationUsers = async () => {
            const userPromises = notifications.map(notification =>
                getUserById(notification.fromUser)
            );

            const users = await Promise.all(userPromises);

            const usersMap = {};
            notifications.forEach((notification, index) => {
                usersMap[notification.fromUser] = users[index];
            });

            console.log(usersMap);

            setNotificationUsers(usersMap);
        };

        if (notifications.length > 0) {
            fetchNotificationUsers();
        }
    }, [notifications]);

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
                                    const fromUser = notificationUsers[notification.fromUser];
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
                                            onClick={() => window.location.href = `/compte?id=${notification.fromUser}`}
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