import { React, useEffect, useState } from "react";
import NavigBar from "../../components/NavigBar";
import Footer from "../../components/Footer";
import { COLORS } from "../../utils/colors";
import API from "../../utils/API";

function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [routeStats, setRouteStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === process.env.REACT_APP_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Incorrect password');
        }
    };

    useEffect(() => {
        API.getRouteStats().then(res => setRouteStats(res.data)).catch(setError).finally(() => setLoading(false));
    }, []);

    if (!isAuthenticated) {
        return (
            <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                <div className="page-container">
                    <NavigBar location="admin" />
                    <div className="content-wrap" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                        <div className="basic-flex popInElement" style={{ flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <h1>Admin Login</h1>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
                                <input
                                    type="password"
                                    className="form-control mr-2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Mot de passe"
                                />
                                <button className="btn btn-dark large-margin-updown" type="submit">Login</button>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                            </form>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div >
        );
    }


    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="admin" />
                <div className="content-wrap" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                    {loading ? <Loader /> :
                        <div className="basic-flex popInElement" style={{ flexDirection: 'column', gap: '20px', alignItems: 'center', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
                            <h1>Route Stats</h1>
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Route</th>
                                        <th>Count</th>
                                        <th>Avg (ms)</th>
                                        <th>Min (ms)</th>
                                        <th>Max (ms)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(routeStats)
                                        .sort(([, a], [, b]) => b.avg - a.avg)
                                        .map(([route, stats]) => (
                                            <tr key={route}>
                                                <td title={route}>{route.length > 30 ? route.slice(0, 30) + '...' : route}</td>
                                                <td>{stats.count}</td>
                                                <td>{Number(stats.avg).toFixed(2)}</td>
                                                <td>{Number(stats.min).toFixed(2)}</td>
                                                <td>{Number(stats.max).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Admin