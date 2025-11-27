import React, { useState, useEffect, useCallback } from 'react';
import API from '../../utils/API';
import { MiniLoader } from '../../components/Loader';
import NavigBar from '../../components/NavigBar';

const Shift = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shift, setShift] = useState(null);
    const [stats, setStats] = useState(null);
    const [shiftType, setShiftType] = useState('office');
    const [currentTime, setCurrentTime] = useState(new Date());

    const userId = localStorage.getItem('id');

    // Update current time every second for real-time display
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch active shift and stats
    const fetchData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [shiftRes, statsRes] = await Promise.all([
                API.getActiveShift(userId),
                API.getShiftStats(userId, true)
            ]);
            setShift(shiftRes.data.shift);
            setStats(statsRes.data.stats);
        } catch (err) {
            console.error('Error fetching shift data:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refresh stats every 30 seconds
    useEffect(() => {
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleStartShift = async () => {
        try {
            setLoading(true);
            const res = await API.createShift(userId, shiftType);
            setShift(res.data.shift);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStartBreak = async () => {
        try {
            setLoading(true);
            const res = await API.breakStart(userId);
            setShift(res.data.shift);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStopBreak = async () => {
        try {
            setLoading(true);
            const res = await API.breakStop(userId);
            setShift(res.data.shift);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEndShift = async () => {
        try {
            setLoading(true);
            await API.endShift(userId);
            setShift(null);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Format seconds to HH:MM:SS
    const formatDuration = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate real-time elapsed seconds
    const getElapsedSeconds = (startTime) => {
        if (!startTime) return 0;
        return Math.floor((currentTime - new Date(startTime)) / 1000);
    };

    // Calculate current shift duration in real-time
    const getCurrentShiftDuration = () => {
        if (!shift) return 0;
        return getElapsedSeconds(shift.startedAt);
    };

    // Calculate current break duration in real-time
    const getCurrentBreakDuration = () => {
        if (!shift) return 0;
        let totalBreak = shift.breakDurationSeconds || 0;
        // If break is currently in progress, add the ongoing time
        if (shift.breakStartedAt && !shift.breakEndedAt) {
            totalBreak += getElapsedSeconds(shift.breakStartedAt);
        }
        return totalBreak;
    };

    // Calculate net work time (total - breaks)
    const getNetWorkTime = () => {
        return getCurrentShiftDuration() - getCurrentBreakDuration();
    };

    const isOnBreak = shift && shift.breakStartedAt && !shift.breakEndedAt;


    return (
        <div>
            <NavigBar location="shift" />

            <div style={styles.container}>


                <div style={styles.mainContent}>
                    {/* Header */}
                    <div style={styles.header}>
                        <h1 style={styles.mainTitle}>⏱️ Shift Tracker</h1>
                        <div style={styles.currentTime}>
                            {currentTime.toLocaleTimeString('fr-FR')}
                        </div>
                    </div>

                    {error && (
                        <div style={styles.errorBanner}>
                            {error}
                            <button onClick={() => setError('')} style={styles.dismissError}>✕</button>
                        </div>
                    )}

                    {loading && !shift && !stats ? (
                        <MiniLoader />
                    ) : (
                        <>
                            {/* Active Shift Card */}
                            <div style={styles.card}>
                                <h2 style={styles.cardTitle}>
                                    {shift ? '🟢 Active Shift' : '⚫ No Active Shift'}
                                </h2>

                                {shift ? (
                                    <div style={styles.shiftDetails}>
                                        <div style={styles.shiftType}>
                                            <span style={{
                                                ...styles.typeBadge,
                                                backgroundColor: shift.type === 'remote' ? '#3b82f6' : '#8b5cf6'
                                            }}>
                                                {shift.type === 'remote' ? '🏠 Remote' : '🏢 Office'}
                                            </span>
                                        </div>

                                        <div style={styles.timerGrid}>
                                            <div style={styles.timerCard}>
                                                <span style={styles.timerLabel}>Total Time</span>
                                                <span style={styles.timerValue}>
                                                    {formatDuration(getCurrentShiftDuration())}
                                                </span>
                                            </div>
                                            <div style={{
                                                ...styles.timerCard,
                                                backgroundColor: isOnBreak ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.1)'
                                            }}>
                                                <span style={styles.timerLabel}>
                                                    {isOnBreak ? '☕ On Break' : 'Break Time'}
                                                </span>
                                                <span style={{
                                                    ...styles.timerValue,
                                                    color: isOnBreak ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {formatDuration(getCurrentBreakDuration())}
                                                </span>
                                            </div>
                                            <div style={{
                                                ...styles.timerCard,
                                                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                gridColumn: '1 / -1'
                                            }}>
                                                <span style={styles.timerLabel}>Net Work Time</span>
                                                <span style={{
                                                    ...styles.timerValue,
                                                    color: '#22c55e',
                                                    fontSize: '2.5rem'
                                                }}>
                                                    {formatDuration(getNetWorkTime())}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={styles.buttonGroup}>
                                            {isOnBreak ? (
                                                <button
                                                    onClick={handleStopBreak}
                                                    style={{ ...styles.button, ...styles.resumeButton }}
                                                    disabled={loading}
                                                >
                                                    ▶️ Resume Work
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleStartBreak}
                                                    style={{ ...styles.button, ...styles.breakButton }}
                                                    disabled={loading}
                                                >
                                                    ☕ Start Break
                                                </button>
                                            )}
                                            <button
                                                onClick={handleEndShift}
                                                style={{ ...styles.button, ...styles.endButton }}
                                                disabled={loading}
                                            >
                                                🛑 End Shift
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={styles.startShiftSection}>
                                        <div style={styles.typeSelector}>
                                            <button
                                                onClick={() => setShiftType('remote')}
                                                style={{
                                                    ...styles.typeButton,
                                                    ...(shiftType === 'remote' ? styles.typeButtonActive : {})
                                                }}
                                            >
                                                🏠 Remote
                                            </button>
                                            <button
                                                onClick={() => setShiftType('office')}
                                                style={{
                                                    ...styles.typeButton,
                                                    ...(shiftType === 'office' ? styles.typeButtonActiveOffice : {})
                                                }}
                                            >
                                                🏢 Office
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleStartShift}
                                            style={{ ...styles.button, ...styles.startButton }}
                                            disabled={loading}
                                        >
                                            🚀 Start Shift
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Stats Card */}
                            {stats && (
                                <div style={styles.card}>
                                    <h2 style={styles.cardTitle}>📊 Year {stats.year} Statistics</h2>

                                    <div style={styles.statsGrid}>
                                        {/* Remote Stats */}
                                        <div style={styles.statSection}>
                                            <h3 style={{ ...styles.statSectionTitle, color: '#3b82f6' }}>
                                                🏠 Remote
                                            </h3>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Shifts</span>
                                                <span style={styles.statValue}>{stats.remote.shiftCount}</span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Total Time</span>
                                                <span style={styles.statValue}>{stats.remote.totalTime.formatted}</span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Break Time</span>
                                                <span style={{ ...styles.statValue, color: '#ef4444' }}>
                                                    {stats.remote.totalBreakTime.formatted}
                                                </span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Net Work</span>
                                                <span style={{ ...styles.statValue, color: '#22c55e' }}>
                                                    {stats.remote.netTime.formatted}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Office Stats */}
                                        <div style={styles.statSection}>
                                            <h3 style={{ ...styles.statSectionTitle, color: '#8b5cf6' }}>
                                                🏢 Office
                                            </h3>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Shifts</span>
                                                <span style={styles.statValue}>{stats.office.shiftCount}</span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Total Time</span>
                                                <span style={styles.statValue}>{stats.office.totalTime.formatted}</span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Break Time</span>
                                                <span style={{ ...styles.statValue, color: '#ef4444' }}>
                                                    {stats.office.totalBreakTime.formatted}
                                                </span>
                                            </div>
                                            <div style={styles.statItem}>
                                                <span style={styles.statLabel}>Net Work</span>
                                                <span style={{ ...styles.statValue, color: '#22c55e' }}>
                                                    {stats.office.netTime.formatted}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Total Stats */}
                                        <div style={{ ...styles.statSection, gridColumn: '1 / -1', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                                            <h3 style={{ ...styles.statSectionTitle, color: '#ffffff' }}>
                                                📈 Total
                                            </h3>
                                            <div style={styles.totalStatsRow}>
                                                <div style={styles.totalStatItem}>
                                                    <span style={styles.totalStatLabel}>Shifts</span>
                                                    <span style={styles.totalStatValue}>{stats.total.shiftCount}</span>
                                                </div>
                                                <div style={styles.totalStatItem}>
                                                    <span style={styles.totalStatLabel}>Total</span>
                                                    <span style={styles.totalStatValue}>{stats.total.totalTime.formatted}</span>
                                                </div>
                                                <div style={styles.totalStatItem}>
                                                    <span style={styles.totalStatLabel}>Breaks</span>
                                                    <span style={{ ...styles.totalStatValue, color: '#ef4444' }}>
                                                        {stats.total.totalBreakTime.formatted}
                                                    </span>
                                                </div>
                                                <div style={styles.totalStatItem}>
                                                    <span style={styles.totalStatLabel}>Net Work</span>
                                                    <span style={{ ...styles.totalStatValue, color: '#22c55e' }}>
                                                        {stats.total.netTime.formatted}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ratio */}
                                        {stats.percentRemoteOverOffice && (
                                            <div style={{ ...styles.statSection, gridColumn: '1 / -1' }}>
                                                <h3 style={styles.statSectionTitle}>⚖️ Remote / Office Ratio</h3>

                                                {/* Visual ratio bar */}
                                                {stats.total.shiftCount > 0 && (
                                                    <>
                                                        <div style={styles.ratioBar}>
                                                            <div style={{
                                                                ...styles.ratioFill,
                                                                width: `${Math.min(100, (stats.remote.shiftCount / stats.total.shiftCount) * 100)}%`
                                                            }} />
                                                        </div>
                                                        <div style={styles.ratioLabels}>
                                                            <span>🏠 {stats.remote.shiftCount} shifts</span>
                                                            <span>🏢 {stats.office.shiftCount} shifts</span>
                                                        </div>
                                                    </>
                                                )}

                                                {/* Percentage stats */}
                                                <div style={styles.percentageGrid}>
                                                    <div style={styles.percentageItem}>
                                                        <span style={styles.percentageLabel}>Shift Count</span>
                                                        <span style={styles.percentageValue}>
                                                            {stats.percentRemoteOverOffice.shiftCount !== null
                                                                ? `${stats.percentRemoteOverOffice.shiftCount}%`
                                                                : '—'}
                                                        </span>
                                                    </div>
                                                    <div style={styles.percentageItem}>
                                                        <span style={styles.percentageLabel}>Total Time</span>
                                                        <span style={styles.percentageValue}>
                                                            {stats.percentRemoteOverOffice.totalSeconds !== null
                                                                ? `${stats.percentRemoteOverOffice.totalSeconds}%`
                                                                : '—'}
                                                        </span>
                                                    </div>
                                                    <div style={styles.percentageItem}>
                                                        <span style={styles.percentageLabel}>Break Time</span>
                                                        <span style={{ ...styles.percentageValue, color: '#ef4444' }}>
                                                            {stats.percentRemoteOverOffice.totalBreakSeconds !== null
                                                                ? `${stats.percentRemoteOverOffice.totalBreakSeconds}%`
                                                                : '—'}
                                                        </span>
                                                    </div>
                                                    <div style={styles.percentageItem}>
                                                        <span style={styles.percentageLabel}>Net Work</span>
                                                        <span style={{ ...styles.percentageValue, color: '#22c55e' }}>
                                                            {stats.percentRemoteOverOffice.netSeconds !== null
                                                                ? `${stats.percentRemoteOverOffice.netSeconds}%`
                                                                : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={styles.percentageNote}>
                                                    % = Remote time / Office time
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '20px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace",
    },
    loginCard: {
        maxWidth: '400px',
        margin: '100px auto',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
    },
    lockIcon: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    title: {
        color: '#ffffff',
        fontSize: '1.5rem',
        marginBottom: '30px',
        fontWeight: '300',
        letterSpacing: '2px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    input: {
        padding: '15px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontSize: '1rem',
        outline: 'none',
        textAlign: 'center',
    },
    loginButton: {
        padding: '15px',
        borderRadius: '10px',
        border: 'none',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    error: {
        color: '#ef4444',
        marginTop: '15px',
        fontSize: '0.9rem',
    },
    mainContent: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '10px',
    },
    mainTitle: {
        color: '#ffffff',
        fontSize: '1.8rem',
        fontWeight: '300',
        letterSpacing: '1px',
        margin: 0,
    },
    currentTime: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '1.2rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    errorBanner: {
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.5)',
        borderRadius: '10px',
        padding: '15px 20px',
        marginBottom: '20px',
        color: '#ef4444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dismissError: {
        background: 'transparent',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer',
        fontSize: '1.2rem',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: '1.3rem',
        fontWeight: '400',
        marginBottom: '25px',
        marginTop: 0,
    },
    shiftDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
    },
    shiftType: {
        textAlign: 'center',
    },
    typeBadge: {
        padding: '8px 20px',
        borderRadius: '20px',
        color: '#ffffff',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    timerGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    timerCard: {
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '15px',
        padding: '20px',
        textAlign: 'center',
    },
    timerLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    timerValue: {
        display: 'block',
        color: '#ffffff',
        fontSize: '1.8rem',
        fontWeight: '300',
        fontFamily: "'JetBrains Mono', monospace",
    },
    buttonGroup: {
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
    },
    button: {
        flex: 1,
        minWidth: '150px',
        padding: '15px 25px',
        borderRadius: '12px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    breakButton: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#ffffff',
    },
    resumeButton: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
    },
    endButton: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
    },
    startShiftSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
    },
    typeSelector: {
        display: 'flex',
        gap: '10px',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '5px',
        borderRadius: '15px',
    },
    typeButton: {
        padding: '12px 25px',
        borderRadius: '12px',
        border: 'none',
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.95rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
    typeButtonActive: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
    },
    typeButtonActiveOffice: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: '#ffffff',
    },
    startButton: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#ffffff',
        minWidth: '200px',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
    },
    statSection: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        padding: '20px',
    },
    statSectionTitle: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '15px',
        marginTop: 0,
        color: '#ffffff'
    },
    statItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem',
    },
    statValue: {
        color: '#ffffff',
        fontSize: '0.95rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    totalStatsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '20px',
    },
    totalStatItem: {
        textAlign: 'center',
    },
    totalStatLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.8rem',
        marginBottom: '5px',
        textTransform: 'uppercase',
    },
    totalStatValue: {
        display: 'block',
        color: '#ffffff',
        fontSize: '1.2rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    ratioBar: {
        height: '8px',
        background: 'rgba(139, 92, 246, 0.3)',
        borderRadius: '4px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    ratioFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)',
        borderRadius: '4px',
        transition: 'width 0.3s ease',
    },
    ratioLabels: {
        display: 'flex',
        justifyContent: 'space-between',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.8rem',
        marginBottom: '20px',
    },
    percentageGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginTop: '15px',
    },
    percentageItem: {
        textAlign: 'center',
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '12px 8px',
    },
    percentageLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.7rem',
        marginBottom: '5px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    percentageValue: {
        display: 'block',
        color: '#ffffff',
        fontSize: '1.1rem',
        fontWeight: '500',
        fontFamily: "'JetBrains Mono', monospace",
    },
    percentageNote: {
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '0.7rem',
        marginTop: '12px',
        fontStyle: 'italic',
    },
};

// Add responsive styles
const mediaQuery = window.matchMedia('(max-width: 600px)');
if (mediaQuery.matches) {
    styles.timerGrid.gridTemplateColumns = '1fr';
    styles.statsGrid.gridTemplateColumns = '1fr';
    styles.percentageGrid.gridTemplateColumns = 'repeat(2, 1fr)';
}

export default Shift;

