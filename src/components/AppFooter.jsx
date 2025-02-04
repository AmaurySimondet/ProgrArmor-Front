import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MiniLoader } from "./Loader";
import ProfilePic from "./profilePic";
import { getUserById } from "../utils/user";
import API from "../utils/API";

function AppFooter() {
    const location = useLocation();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const isActive = (path) => {
        return location.pathname === path ? "active-footer-link" : "";
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                getUserById(localStorage.getItem('id')).then(setUser);
                const response = await API.getNotifications({
                    userId: localStorage.getItem('id')
                });
                const unreadNotifications = response.data.notifications.filter(notification => !notification.read);
                console.log(unreadNotifications);
                setNotifications(unreadNotifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <MiniLoader />
    }

    return (
        <footer className="app-footer">
            <div className="footer-container">
                <a href="/dashboard" className={`footer-link ${isActive('/dashboard')}`}>
                    <img
                        className="footer-icon"
                        src={require('../images/icons/home.webp')}
                        style={{ filter: location.pathname === '/dashboard' ? "invert(1)" : "invert(0.3)" }}
                        alt='home'
                    />
                    <span>Home</span>
                </a>

                <a href="/programme" className={`footer-link ${isActive('/programme')}`}>
                    <img
                        className="footer-icon"
                        src={require('../images/icons/coach.webp')}
                        alt='coachings'
                        style={{ filter: location.pathname === '/programme' ? "invert(1)" : "invert(0.3)" }}
                    />
                    <span>Coachings</span>
                </a>

                <a href="/session" className={`footer-link ${isActive('/session')}`}>
                    <img
                        className="footer-icon"
                        src={require('../images/icons/write.webp')}
                        alt='nouvelle séance'
                        style={{ filter: location.pathname === '/session' ? "invert(1)" : "invert(0.3)" }}
                    />
                    <span>Séance</span>
                </a>

                <a href="/notifications" className={`footer-link ${isActive('/notifications')}`}>
                    <div style={{ position: 'relative' }}>
                        <span className="badge rounded-pill bg-warning text-dark popInElement"
                            style={{
                                scale: "1.5",
                                fontWeight: "bold",
                                boxShadow: "0 0 5px rgba(255, 255, 255, 0.5)",
                                visibility: notifications.length > 0 ? "visible" : "hidden",
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                zIndex: 1
                            }}>
                            {notifications.length}
                        </span>
                        <img
                            className="footer-icon"
                            src={require('../images/icons/notifications.webp')}
                            alt='notifications'
                            style={{ filter: location.pathname === '/notifications' ? "invert(1)" : "invert(0.3)" }}
                        />
                    </div>
                    <span>Notifications</span>
                </a>

                <a href={`/compte?id=${localStorage.getItem('id')}`} className={`footer-link ${isActive('/compte')}`}>
                    <ProfilePic user={user} size="28px" onClick={() => {
                        window.location.href = `/compte?id=${user._id}`;
                    }} />
                    <span>Moi</span>
                </a>
            </div>
        </footer>
    );
}

export default AppFooter;