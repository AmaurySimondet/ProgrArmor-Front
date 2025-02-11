import { React, useState, useEffect } from "react";
import API from "../utils/API.js";
import { Outlet, Navigate, useLocation } from "react-router-dom";

function PrivateRoute() {
    const [auth, setAuth] = useState();
    const location = useLocation();

    async function handleAuth() {
        const res = await API.isAuth();
        setAuth(res);
    }

    useEffect(() => {
        setTimeout(handleAuth(), 50);
    }, []);

    if (auth === true) {
        return <Outlet />
    }
    if (auth === false) {
        // Capture current path and query parameters
        const currentPath = `${location.pathname}${location.search}`;
        // Redirect to login with the encoded current URL as redirect parameter
        return <Navigate to={`/connexion?redirect=${encodeURIComponent(currentPath)}`} />;
    }
};

export default PrivateRoute;