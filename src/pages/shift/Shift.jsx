import React, { useState, useEffect, useCallback } from 'react';
import API from '../../utils/API';
import { MiniLoader } from '../../components/Loader';
import NavigBar from '../../components/NavigBar';

const Shift = () => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shift, setShift] = useState(null);
    const [stats, setStats] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [parameters, setParameters] = useState(null);
    const [shiftType, setShiftType] = useState('office');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState('tracker'); // 'tracker', 'schedule', 'stats', 'parameters', 'history'

    // History tab state
    const [allShifts, setAllShifts] = useState([]);
    const [shiftsTotal, setShiftsTotal] = useState(0);
    const [shiftsPage, setShiftsPage] = useState(0);
    const [shiftsLoading, setShiftsLoading] = useState(false);
    const [editingShift, setEditingShift] = useState(null);
    const [editForm, setEditForm] = useState({
        type: 'office',
        startedAt: '',
        endedAt: '',
        breakDurationSeconds: 0,
        toCreate: false
    });

    // Form state for parameters
    const [paramForm, setParamForm] = useState({
        netWorkTimeMinimumSeconds: 25200, // 7 hours
        breakDurationMinimumSeconds: 3600, // 1 hour
        weekSchedule: {
            monday: 'office',
            tuesday: 'office',
            wednesday: 'remote',
            thursday: 'office',
            friday: 'remote',
            saturday: 'off',
            sunday: 'off'
        }
    });

    const userId = localStorage.getItem('id');

    // Update current time every second for real-time display
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch all data
    const fetchData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const [shiftRes, statsRes, scheduleRes, paramsRes] = await Promise.all([
                API.getActiveShift(userId),
                API.getShiftStats(userId, true),
                API.getShiftSchedule(userId),
                API.getShiftParameters(userId)
            ]);
            setShift(shiftRes.data.shift);
            setStats(statsRes.data.stats);
            setSchedule(scheduleRes.data.schedule);
            setParameters(paramsRes.data.parameters);

            // Update form with existing parameters
            if (paramsRes.data.parameters) {
                setParamForm({
                    netWorkTimeMinimumSeconds: paramsRes.data.parameters.netWorkTimeMinimumSeconds || 25200,
                    breakDurationMinimumSeconds: paramsRes.data.parameters.breakDurationMinimumSeconds || 3600,
                    weekSchedule: paramsRes.data.parameters.weekSchedule || {
                        monday: 'office',
                        tuesday: 'office',
                        wednesday: 'remote',
                        thursday: 'office',
                        friday: 'remote',
                        saturday: 'off',
                        sunday: 'off'
                    }
                });
            }
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

    const handleSaveParameters = async () => {
        try {
            setLoading(true);
            const res = await API.createOrUpdateShiftParameters(userId, paramForm);
            setParameters(res.data.parameters);
            await fetchData();
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch all shifts with pagination
    const fetchAllShifts = async (page = 0, reset = false) => {
        if (!userId) return;
        setShiftsLoading(true);
        try {
            const limit = 20;
            const res = await API.getAllShifts(userId, {
                limit,
                skip: page * limit
            });
            if (reset) {
                setAllShifts(res.data.shifts);
            } else {
                setAllShifts(prev => [...prev, ...res.data.shifts]);
            }
            setShiftsTotal(res.data.total);
            setShiftsPage(page);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setShiftsLoading(false);
        }
    };

    // Load more shifts
    const handleLoadMoreShifts = () => {
        fetchAllShifts(shiftsPage + 1);
    };

    // Open edit modal
    const handleEditShift = (shiftToEdit) => {
        setEditingShift(shiftToEdit);
        setEditForm({
            type: shiftToEdit.type,
            startedAt: formatDateTimeLocal(shiftToEdit.startedAt),
            endedAt: shiftToEdit.endedAt ? formatDateTimeLocal(shiftToEdit.endedAt) : '',
            breakDurationSeconds: shiftToEdit.breakDurationSeconds || 0
        });
    };

    const handleScheduleDayOff = () => {
        setEditingShift({
            type: 'off',
            startedAt: '',
            endedAt: '',
            breakDurationSeconds: 0,
            toCreate: true
        });
        setEditForm({
            type: 'off',
            startedAt: '',
            endedAt: '',
            breakDurationSeconds: 0,
            toCreate: true
        });
    };

    const handleDeleteShift = async (shiftToDelete) => {
        try {
            setLoading(true);
            await API.deleteShift(userId, shiftToDelete._id);
            await fetchAllShifts(0, true);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Format date for datetime-local input
    const formatDateTimeLocal = (dateStr) => {
        const date = new Date(dateStr);
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    // Save edited shift
    const handleSaveShift = async () => {
        if (!editingShift) return;
        try {
            if (editingShift.toCreate) {
                console.log('creating shift', editForm);
                await API.createShift(userId, editForm.type, editForm.startedAt, editForm.endedAt);
            } else {
                setLoading(true);
                await API.updateShift(userId, editingShift._id, {
                    type: editForm.type,
                    startedAt: new Date(editForm.startedAt).toISOString(),
                    endedAt: editForm.endedAt ? new Date(editForm.endedAt).toISOString() : undefined,
                    breakDurationSeconds: parseInt(editForm.breakDurationSeconds) || 0
                });
                setEditingShift(null);
            }
            // Refresh shifts list
            await fetchAllShifts(0, true);
            await fetchData();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingShift(null);
    };

    // Load shifts when history tab is selected
    useEffect(() => {
        if (activeTab === 'history' && allShifts.length === 0) {
            fetchAllShifts(0, true);
        }
    }, [activeTab]);

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

    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    // Render tab navigation
    const renderTabs = () => (
        <div style={styles.tabContainer}>
            {['tracker', 'schedule', 'stats', 'history', 'parameters'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        ...styles.tab,
                        ...(activeTab === tab ? styles.tabActive : {})
                    }}
                >
                    {tab === 'tracker' && '⏱️'}
                    {tab === 'schedule' && '📅'}
                    {tab === 'stats' && '📊'}
                    {tab === 'history' && '📜'}
                    {tab === 'parameters' && '⚙️'}
                    <span style={styles.tabLabel}>
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </span>
                </button>
            ))}
        </div>
    );

    // Render Active Shift / Start Shift section
    const renderTracker = () => (
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

                    {/* Daily progress vs parameters */}
                    {parameters && parameters.netWorkTimeMinimumSeconds > 0 && (
                        <div style={styles.dailyProgress}>
                            <div style={styles.dailyProgressHeader}>
                                <span style={styles.dailyProgressLabel}>Day Progress</span>
                                <span style={styles.dailyProgressValue}>
                                    {Math.min(
                                        999,
                                        Math.max(
                                            0,
                                            Math.round(
                                                (getNetWorkTime() / parameters.netWorkTimeMinimumSeconds) * 100
                                            )
                                        )
                                    )}%{/* percent */}
                                </span>
                            </div>
                            <div style={styles.progressBar}>
                                <div
                                    style={{
                                        ...styles.progressFill,
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                Math.round(
                                                    (getNetWorkTime() / parameters.netWorkTimeMinimumSeconds) * 100
                                                )
                                            )
                                        )}%`,
                                        backgroundColor:
                                            getNetWorkTime() >= parameters.netWorkTimeMinimumSeconds
                                                ? '#22c55e'
                                                : '#3b82f6'
                                    }}
                                />
                            </div>
                            <div style={styles.dailyProgressSub}>
                                <span>
                                    {formatDuration(getNetWorkTime())} /{' '}
                                    {formatDuration(parameters.netWorkTimeMinimumSeconds)}
                                </span>
                            </div>
                        </div>
                    )}

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
    );

    // Render Schedule Tab
    const renderSchedule = () => (
        schedule ? (
            <>
                {/* Current Week */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        📅 Current Week
                        <span style={styles.dateRange}>
                            {formatDate(schedule.currentWeek.start)} - {formatDate(schedule.currentWeek.end)}
                        </span>
                    </h2>

                    <div style={styles.weekGrid}>
                        {/* Current week stats */}
                        <div style={styles.weekSection}>
                            <h3 style={styles.weekSectionTitle}>📈 Progress</h3>
                            <div style={styles.progressBar}>
                                <div
                                    style={{
                                        ...styles.progressFill,
                                        width: `${Math.min(100, schedule.currentWeek.progress?.hoursPercent || 0)}%`,
                                        backgroundColor: (schedule.currentWeek.progress?.hoursPercent || 0) >= 100 ? '#22c55e' : '#3b82f6'
                                    }}
                                />
                            </div>
                            <div style={styles.progressLabels}>
                                <span>{schedule.currentWeek.progress?.hoursPercent?.toFixed(1) || 0}% of weekly goal</span>
                            </div>

                            <div style={styles.weekStatsGrid}>
                                <div style={styles.weekStatItem}>
                                    <span style={styles.weekStatLabel}>Net Work</span>
                                    <span style={{ ...styles.weekStatValue, color: '#22c55e' }}>
                                        {schedule.currentWeek.current?.netHours?.formatted || '0h 0m 0s'}
                                    </span>
                                </div>
                                <div style={styles.weekStatItem}>
                                    <span style={styles.weekStatLabel}>Expected</span>
                                    <span style={styles.weekStatValue}>
                                        {schedule.currentWeek.expected?.netHours?.formatted || '0h 0m 0s'}
                                    </span>
                                </div>
                                <div style={styles.weekStatItem}>
                                    <span style={styles.weekStatLabel}>Shifts</span>
                                    <span style={styles.weekStatValue}>
                                        {schedule.currentWeek.current?.shiftCount || 0} / {schedule.currentWeek.expected?.workDays || 0}
                                    </span>
                                </div>
                                <div style={styles.weekStatItem}>
                                    <span style={styles.weekStatLabel}>Break Time</span>
                                    <span style={{ ...styles.weekStatValue, color: '#ef4444' }}>
                                        {schedule.currentWeek.current?.breakHours?.formatted || '0h 0m 0s'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Remote vs Office */}
                        <div style={styles.weekSection}>
                            <h3 style={styles.weekSectionTitle}>⚖️ Remote vs Office</h3>
                            <div style={styles.ratioBar}>
                                <div style={{
                                    ...styles.ratioFill,
                                    width: `${schedule.currentWeek.current?.remotePercent || 0}%`
                                }} />
                            </div>
                            <div style={styles.ratioLabels}>
                                <span>🏠 {schedule.currentWeek.current?.remote?.shiftCount || 0} ({schedule.currentWeek.current?.remotePercent?.toFixed(1) || 0}%)</span>
                                <span>🏢 {schedule.currentWeek.current?.office?.shiftCount || 0}</span>
                            </div>
                            <div style={styles.miniStatsRow}>
                                <div style={styles.miniStat}>
                                    <span style={{ color: '#3b82f6' }}>🏠 {schedule.currentWeek.current?.remote?.netTime?.formatted || '0h 0m 0s'}</span>
                                </div>
                                <div style={styles.miniStat}>
                                    <span style={{ color: '#8b5cf6' }}>🏢 {schedule.currentWeek.current?.office?.netTime?.formatted || '0h 0m 0s'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Week */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>
                        📆 Previous Week
                        <span style={styles.dateRange}>
                            {formatDate(schedule.previousWeek.start)} - {formatDate(schedule.previousWeek.end)}
                        </span>
                    </h2>

                    <div style={styles.weekStatsGrid}>
                        <div style={styles.weekStatItem}>
                            <span style={styles.weekStatLabel}>Net Work</span>
                            <span style={{ ...styles.weekStatValue, color: '#22c55e' }}>
                                {schedule.previousWeek?.netHours?.formatted || '0h 0m 0s'}
                            </span>
                        </div>
                        <div style={styles.weekStatItem}>
                            <span style={styles.weekStatLabel}>Total Time</span>
                            <span style={styles.weekStatValue}>
                                {schedule.previousWeek?.totalHours?.formatted || '0h 0m 0s'}
                            </span>
                        </div>
                        <div style={styles.weekStatItem}>
                            <span style={styles.weekStatLabel}>Shifts</span>
                            <span style={styles.weekStatValue}>
                                {schedule.previousWeek?.shiftCount || 0}
                            </span>
                        </div>
                        <div style={styles.weekStatItem}>
                            <span style={styles.weekStatLabel}>Break Time</span>
                            <span style={{ ...styles.weekStatValue, color: '#ef4444' }}>
                                {schedule.previousWeek?.breakHours?.formatted || '0h 0m 0s'}
                            </span>
                        </div>
                    </div>

                    <div style={{ ...styles.ratioBar, marginTop: '15px' }}>
                        <div style={{
                            ...styles.ratioFill,
                            width: `${schedule.previousWeek?.remotePercent || 0}%`
                        }} />
                    </div>
                    <div style={styles.ratioLabels}>
                        <span>🏠 {schedule.previousWeek?.remote?.shiftCount || 0} ({schedule.previousWeek?.remotePercent?.toFixed(1) || 0}%)</span>
                        <span>🏢 {schedule.previousWeek?.office?.shiftCount || 0}</span>
                    </div>
                </div>
            </>
        ) : (
            <div style={styles.card}>
                <p style={styles.noData}>No schedule data available</p>
            </div>
        )
    );

    // Render Stats Tab (Year Statistics with expected/progress)
    const renderStats = () => (
        stats ? (
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>📊 Year {stats.year} Statistics</h2>

                {/* Progress Section */}
                {stats.progress && (
                    <div style={{ ...styles.statSection, marginBottom: '20px', background: 'rgba(34, 197, 94, 0.1)' }}>
                        <h3 style={{ ...styles.statSectionTitle, color: '#22c55e' }}>📈 Year Progress</h3>

                        <div style={styles.progressBar}>
                            <div
                                style={{
                                    ...styles.progressFill,
                                    width: `${Math.min(100, stats.progress?.hoursPercent || 0)}%`,
                                    backgroundColor: (stats.progress?.hoursPercent || 0) >= 100 ? '#22c55e' : '#3b82f6'
                                }}
                            />
                        </div>
                        <div style={styles.progressLabels}>
                            <span style={{ color: '#22c55e' }}>
                                {stats.progress?.hoursPercent?.toFixed(1) || 0}% of expected hours so far
                            </span>
                        </div>

                        <div style={styles.progressStatsGrid}>
                            <div style={styles.progressStatItem}>
                                <span style={styles.progressStatLabel}>Hours vs Expected (so far)</span>
                                <span style={{
                                    ...styles.progressStatValue,
                                    color: (stats.progress?.hoursPercent || 0) >= 100 ? '#22c55e' : '#f59e0b'
                                }}>
                                    {stats.progress?.hoursPercent?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div style={styles.progressStatItem}>
                                <span style={styles.progressStatLabel}>Shifts vs Expected (so far)</span>
                                <span style={{
                                    ...styles.progressStatValue,
                                    color: (stats.progress?.shiftsPercent || 0) >= 100 ? '#22c55e' : '#f59e0b'
                                }}>
                                    {stats.progress?.shiftsPercent?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div style={styles.progressStatItem}>
                                <span style={styles.progressStatLabel}>Year Hours Progress</span>
                                <span style={styles.progressStatValue}>
                                    {stats.progress?.yearHoursPercent?.toFixed(1) || 0}%
                                </span>
                            </div>
                            <div style={styles.progressStatItem}>
                                <span style={styles.progressStatLabel}>Year Shifts Progress</span>
                                <span style={styles.progressStatValue}>
                                    {stats.progress?.yearShiftsPercent?.toFixed(1) || 0}%
                                </span>
                            </div>
                        </div>
                    </div>
                )}

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
                                % = Remote time / Total time
                            </div>
                        </div>
                    )}
                </div>

                {/* Expected Section */}
                {stats.expected && (
                    <div style={{ ...styles.statSection, marginBottom: '20px', background: 'rgba(59, 130, 246, 0.1)' }}>
                        <h3 style={{ ...styles.statSectionTitle, color: '#3b82f6' }}>🎯 Expected Values</h3>

                        <div style={styles.expectedGrid}>
                            <div style={styles.expectedColumn}>
                                <h4 style={styles.expectedSubtitle}>So Far (until today)</h4>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Net Hours</span>
                                    <span style={styles.expectedValue}>{stats.expected.soFar?.netHours?.formatted || '—'}</span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Work Days</span>
                                    <span style={styles.expectedValue}>{stats.expected.soFar?.workDays || 0}</span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Remote/Office Shifts</span>
                                    <span style={styles.expectedValue}>
                                        {stats.expected.soFar?.remoteShifts || 0} / {stats.expected.soFar?.officeShifts || 0}
                                    </span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Remote/Office Hours</span>
                                    <span style={styles.expectedValue}>
                                        {(stats.expected.soFar?.remoteSeconds / 3600).toFixed(1) || 0} / {(stats.expected.soFar?.officeSeconds / 3600).toFixed(1) || 0} ({stats.expected.soFar?.remotePercent?.toFixed(1) || 0}%)
                                    </span>
                                </div>
                            </div>
                            <div style={styles.expectedColumn}>
                                <h4 style={styles.expectedSubtitle}>Full Year</h4>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Net Hours</span>
                                    <span style={styles.expectedValue}>{stats.expected.yearTotal?.netHours?.formatted || '—'}</span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Work Days</span>
                                    <span style={styles.expectedValue}>{stats.expected.yearTotal?.workDays || 0}</span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Remote/Office Shifts</span>
                                    <span style={styles.expectedValue}>
                                        {stats.expected.yearTotal?.remoteShifts || 0} / {stats.expected.yearTotal?.officeShifts || 0}
                                    </span>
                                </div>
                                <div style={styles.expectedItem}>
                                    <span style={styles.expectedLabel}>Remote/Office Hours</span>
                                    <span style={styles.expectedValue}>
                                        {(stats.expected.yearTotal?.remoteSeconds / 3600).toFixed(1) || 0} / {(stats.expected.yearTotal?.officeSeconds / 3600).toFixed(1) || 0} ({stats.expected.yearTotal?.remotePercent?.toFixed(1) || 0}%)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <div style={styles.card}>
                <p style={styles.noData}>No statistics available</p>
            </div>
        )
    );

    // Render Parameters Tab
    const renderParameters = () => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayLabels = {
            monday: 'Mon',
            tuesday: 'Tue',
            wednesday: 'Wed',
            thursday: 'Thu',
            friday: 'Fri',
            saturday: 'Sat',
            sunday: 'Sun'
        };

        return (
            <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                    ⚙️ Shift Parameters
                    {!parameters && <span style={styles.newBadge}>New</span>}
                </h2>

                {!parameters && (
                    <div style={styles.warningBanner}>
                        ⚠️ No parameters set. Configure your work schedule to enable progress tracking.
                    </div>
                )}

                <div style={styles.paramSection}>
                    <h3 style={styles.paramSectionTitle}>⏰ Daily Work Settings</h3>

                    <div style={styles.paramRow}>
                        <label style={styles.paramLabel}>Net Work Time (hours)</label>
                        <input
                            type="number"
                            step="0.5"
                            value={parseFloat((paramForm.netWorkTimeMinimumSeconds / 3600).toFixed(2))}
                            onChange={(e) => setParamForm({
                                ...paramForm,
                                netWorkTimeMinimumSeconds: parseFloat(e.target.value || 0) * 3600
                            })}
                            style={styles.paramInput}
                            min="0.5"
                            max="12"
                        />
                    </div>

                    <div style={styles.paramRow}>
                        <label style={styles.paramLabel}>Break Duration (minutes)</label>
                        <input
                            type="number"
                            step="5"
                            value={parseFloat((paramForm.breakDurationMinimumSeconds / 60).toFixed(1))}
                            onChange={(e) => setParamForm({
                                ...paramForm,
                                breakDurationMinimumSeconds: parseFloat(e.target.value || 0) * 60
                            })}
                            style={styles.paramInput}
                            min="0"
                            max="180"
                        />
                    </div>
                </div>

                <div style={styles.paramSection}>
                    <h3 style={styles.paramSectionTitle}>📅 Weekly Schedule</h3>

                    <div style={styles.scheduleGrid}>
                        {days.map((day) => (
                            <div key={day} style={styles.scheduleDay}>
                                <span style={styles.scheduleDayLabel}>{dayLabels[day]}</span>
                                <div style={styles.scheduleDayButtons}>
                                    <button
                                        onClick={() => setParamForm({
                                            ...paramForm,
                                            weekSchedule: { ...paramForm.weekSchedule, [day]: 'remote' }
                                        })}
                                        style={{
                                            ...styles.scheduleDayButton,
                                            ...(paramForm.weekSchedule[day] === 'remote' ? styles.scheduleDayButtonRemote : {})
                                        }}
                                    >
                                        🏠
                                    </button>
                                    <button
                                        onClick={() => setParamForm({
                                            ...paramForm,
                                            weekSchedule: { ...paramForm.weekSchedule, [day]: 'office' }
                                        })}
                                        style={{
                                            ...styles.scheduleDayButton,
                                            ...(paramForm.weekSchedule[day] === 'office' ? styles.scheduleDayButtonOffice : {})
                                        }}
                                    >
                                        🏢
                                    </button>
                                    <button
                                        onClick={() => setParamForm({
                                            ...paramForm,
                                            weekSchedule: { ...paramForm.weekSchedule, [day]: 'off' }
                                        })}
                                        style={{
                                            ...styles.scheduleDayButton,
                                            ...(paramForm.weekSchedule[day] === 'off' ? styles.scheduleDayButtonOff : {})
                                        }}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={styles.scheduleLegend}>
                        <span>🏠 Remote</span>
                        <span>🏢 Office</span>
                        <span>❌ Off</span>
                    </div>
                </div>

                <button
                    onClick={handleSaveParameters}
                    style={{ ...styles.button, ...styles.saveButton }}
                    disabled={loading}
                >
                    {loading ? '💾 Saving...' : '💾 Save Parameters'}
                </button>

                {parameters && (
                    <div style={styles.currentParams}>
                        <h4 style={styles.currentParamsTitle}>Current Settings</h4>
                        <p style={styles.currentParamsText}>
                            Work: {(parameters.netWorkTimeMinimumSeconds / 3600).toFixed(1)}h/day •
                            Break: {(parameters.breakDurationMinimumSeconds / 60).toFixed(0)}min/day
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Format full date and time for display
    const formatFullDateTime = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate shift duration
    const calculateShiftDuration = (shiftItem) => {
        if (!shiftItem.startedAt) return 0;
        const endTime = shiftItem.endedAt ? new Date(shiftItem.endedAt) : new Date();
        const startTime = new Date(shiftItem.startedAt);
        return Math.floor((endTime - startTime) / 1000);
    };

    // Calculate net work time for a shift
    const calculateNetWorkTime = (shiftItem) => {
        if (shiftItem.type === 'off') return 0;
        const total = calculateShiftDuration(shiftItem);
        const breaks = shiftItem.breakDurationSeconds || 0;
        return total - breaks;
    };

    // Render History Tab
    const renderHistory = () => (
        <div style={styles.card}>
            <div style={{ ...styles.cardHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={styles.cardTitle}>
                    📜 Shift History
                    <span style={styles.shiftCount}>({shiftsTotal} total)</span>
                </h2>
                <button
                    onClick={() => handleScheduleDayOff()}
                    style={{ ...styles.editButton, backgroundColor: '#22c55e' }}
                >
                    😴 Schedule a day off
                </button>
            </div>

            {shiftsLoading && allShifts.length === 0 ? (
                <MiniLoader />
            ) : allShifts.length === 0 ? (
                <p style={styles.noData}>No shifts recorded yet</p>
            ) : (
                <>
                    <div style={styles.shiftsList}>
                        {allShifts.map((shiftItem) => (
                            <div key={shiftItem._id} style={styles.shiftItem}>
                                <div style={styles.shiftItemHeader}>
                                    <span style={{
                                        ...styles.shiftTypeBadge,
                                        backgroundColor: shiftItem.type === 'remote' ? '#3b82f6' :
                                            shiftItem.type === 'office' ? '#8b5cf6' : '#6b7280'
                                    }}>
                                        {shiftItem.type === 'remote' ? '🏠' :
                                            shiftItem.type === 'office' ? '🏢' : '❌'} {shiftItem.type}
                                    </span>
                                    <div>
                                        <button
                                            onClick={() => !shiftItem.active ? handleEditShift(shiftItem) : null}
                                            style={styles.editButton}
                                        >
                                            {!shiftItem.active ? '✏️ Edit' : '🟢 In Progress'}
                                        </button>
                                        {!shiftItem.active && (
                                            <button
                                                onClick={() => handleDeleteShift(shiftItem)}
                                                style={styles.editButton}
                                            >
                                                ❌ Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={styles.shiftItemDetails}>
                                    <div style={styles.shiftDetailRow}>
                                        <span style={styles.shiftDetailLabel}>Start:</span>
                                        <span style={styles.shiftDetailValue}>
                                            {formatFullDateTime(shiftItem.startedAt)}
                                        </span>
                                    </div>
                                    <div style={styles.shiftDetailRow}>
                                        <span style={styles.shiftDetailLabel}>End:</span>
                                        <span style={styles.shiftDetailValue}>
                                            {shiftItem.endedAt ? formatFullDateTime(shiftItem.endedAt) :
                                                <span style={{ color: '#22c55e' }}>🟢 In Progress</span>}
                                        </span>
                                    </div>
                                    <div style={styles.shiftDetailRow}>
                                        <span style={styles.shiftDetailLabel}>Duration:</span>
                                        <span style={styles.shiftDetailValue}>
                                            {formatDuration(calculateShiftDuration(shiftItem))}
                                        </span>
                                    </div>
                                    <div style={styles.shiftDetailRow}>
                                        <span style={styles.shiftDetailLabel}>Break:</span>
                                        <span style={{ ...styles.shiftDetailValue, color: '#ef4444' }}>
                                            {formatDuration(shiftItem.breakDurationSeconds || 0)}
                                        </span>
                                    </div>
                                    <div style={styles.shiftDetailRow}>
                                        <span style={styles.shiftDetailLabel}>Net Work:</span>
                                        <span style={{ ...styles.shiftDetailValue, color: '#22c55e' }}>
                                            {formatDuration(calculateNetWorkTime(shiftItem))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {allShifts.length < shiftsTotal && (
                        <button
                            onClick={handleLoadMoreShifts}
                            style={{ ...styles.button, ...styles.loadMoreButton }}
                            disabled={shiftsLoading}
                        >
                            {shiftsLoading ? '⏳ Loading...' : `📥 Load More (${allShifts.length}/${shiftsTotal})`}
                        </button>
                    )}
                </>
            )}

            {/* Edit Modal */}
            {editingShift && (
                <div style={styles.modalOverlay} onClick={handleCancelEdit}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>✏️ Edit Shift</h3>

                        <div style={styles.editFormGroup}>
                            <label style={styles.editLabel}>Type</label>
                            <div style={styles.editTypeSelector}>
                                {['remote', 'office', 'off'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setEditForm({ ...editForm, type })}
                                        style={{
                                            ...styles.editTypeButton,
                                            ...(editForm.type === type ?
                                                (type === 'remote' ? styles.editTypeButtonRemote :
                                                    type === 'office' ? styles.editTypeButtonOffice :
                                                        styles.editTypeButtonOff) : {})
                                        }}
                                    >
                                        {type === 'remote' ? '🏠' : type === 'office' ? '🏢' : '❌'} {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={styles.editFormGroup}>
                            <label style={styles.editLabel}>Start Time</label>
                            <input
                                type="datetime-local"
                                value={editForm.startedAt}
                                onChange={(e) => setEditForm({ ...editForm, startedAt: e.target.value })}
                                style={styles.editInput}
                            />
                        </div>

                        <div style={styles.editFormGroup}>
                            <label style={styles.editLabel}>End Time</label>
                            <input
                                type="datetime-local"
                                value={editForm.endedAt}
                                onChange={(e) => setEditForm({ ...editForm, endedAt: e.target.value })}
                                style={styles.editInput}
                            />
                        </div>

                        <div style={styles.editFormGroup}>
                            <label style={styles.editLabel}>Break Duration (minutes)</label>
                            <input
                                type="number"
                                value={Math.floor((editForm.breakDurationSeconds || 0) / 60)}
                                onChange={(e) => setEditForm({
                                    ...editForm,
                                    breakDurationSeconds: parseInt(e.target.value || 0) * 60
                                })}
                                style={styles.editInput}
                                min="0"
                            />
                        </div>

                        <div style={styles.modalButtons}>
                            <button
                                onClick={handleCancelEdit}
                                style={{ ...styles.button, ...styles.cancelButton }}
                            >
                                ❌ Cancel
                            </button>
                            <button
                                onClick={handleSaveShift}
                                style={{ ...styles.button, ...styles.saveButton }}
                                disabled={loading}
                            >
                                {loading ? '💾 Saving...' : '💾 Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

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

                    {/* Tab Navigation */}
                    {renderTabs()}

                    {loading && !shift && !stats ? (
                        <MiniLoader />
                    ) : (
                        <>
                            {activeTab === 'tracker' && renderTracker()}
                            {activeTab === 'schedule' && renderSchedule()}
                            {activeTab === 'stats' && renderStats()}
                            {activeTab === 'history' && renderHistory()}
                            {activeTab === 'parameters' && renderParameters()}
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
    mainContent: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
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
    tabContainer: {
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '6px',
        borderRadius: '15px',
        flexWrap: 'wrap',
    },
    tab: {
        flex: 1,
        minWidth: '70px',
        padding: '12px 16px',
        borderRadius: '10px',
        border: 'none',
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
    },
    tabActive: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
    },
    tabLabel: {
        display: 'none',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        padding: '25px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: '1.3rem',
        fontWeight: '400',
        marginBottom: '20px',
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
    },
    dateRange: {
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '300',
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
    saveButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        width: '100%',
        marginTop: '20px',
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
        marginBottom: '10px',
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
    // Schedule styles
    weekGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '20px',
    },
    weekSection: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        padding: '20px',
    },
    weekSectionTitle: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '15px',
        marginTop: 0,
        color: '#ffffff',
    },
    progressBar: {
        height: '10px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '5px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    progressFill: {
        height: '100%',
        borderRadius: '5px',
        transition: 'width 0.3s ease',
    },
    progressLabels: {
        display: 'flex',
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem',
        marginBottom: '15px',
    },
    weekStatsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
    },
    weekStatItem: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '12px',
        textAlign: 'center',
    },
    weekStatLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.75rem',
        marginBottom: '5px',
        textTransform: 'uppercase',
    },
    weekStatValue: {
        display: 'block',
        color: '#ffffff',
        fontSize: '0.95rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    miniStatsRow: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
    },
    miniStat: {
        fontSize: '0.85rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    noData: {
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        padding: '40px 0',
    },
    // Progress stats styles
    progressStatsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '15px',
        marginTop: '15px',
    },
    progressStatItem: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '10px',
        padding: '12px',
        textAlign: 'center',
    },
    progressStatLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.7rem',
        marginBottom: '5px',
        textTransform: 'uppercase',
    },
    progressStatValue: {
        display: 'block',
        color: '#ffffff',
        fontSize: '1.1rem',
        fontWeight: '500',
        fontFamily: "'JetBrains Mono', monospace",
    },
    // Daily progress styles (tracker)
    dailyProgress: {
        marginTop: '20px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    },
    dailyProgressHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '6px',
    },
    dailyProgressLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    dailyProgressValue: {
        color: '#22c55e',
        fontSize: '0.95rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    dailyProgressSub: {
        marginTop: '6px',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.8rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    // Expected stats styles
    expectedGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
    },
    expectedColumn: {
        background: 'rgba(0, 0, 0, 0.15)',
        borderRadius: '10px',
        padding: '15px',
    },
    expectedSubtitle: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        marginBottom: '12px',
        marginTop: 0,
        fontWeight: '400',
    },
    expectedItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '6px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    expectedLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.8rem',
    },
    expectedValue: {
        color: '#ffffff',
        fontSize: '0.9rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    // Parameters styles
    warningBanner: {
        background: 'rgba(245, 158, 11, 0.2)',
        border: '1px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '20px',
        color: '#f59e0b',
        fontSize: '0.9rem',
    },
    newBadge: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '10px',
        fontSize: '0.7rem',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    paramSection: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        marginBottom: '20px',
    },
    paramSectionTitle: {
        fontSize: '1rem',
        fontWeight: '500',
        marginBottom: '15px',
        marginTop: 0,
        color: '#ffffff',
    },
    paramRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px',
    },
    paramLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem',
    },
    paramInput: {
        width: '80px',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontSize: '1rem',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
    },
    scheduleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '15px',
    },
    scheduleDay: {
        textAlign: 'center',
    },
    scheduleDayLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.75rem',
        marginBottom: '8px',
        textTransform: 'uppercase',
    },
    scheduleDayButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    scheduleDayButton: {
        padding: '8px',
        borderRadius: '6px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        cursor: 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s',
    },
    scheduleDayButtonRemote: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
    scheduleDayButtonOffice: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    },
    scheduleDayButtonOff: {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
    },
    scheduleLegend: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.8rem',
    },
    currentParams: {
        marginTop: '20px',
        padding: '15px',
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '10px',
        border: '1px solid rgba(34, 197, 94, 0.3)',
    },
    currentParamsTitle: {
        color: '#22c55e',
        fontSize: '0.9rem',
        marginBottom: '8px',
        marginTop: 0,
    },
    currentParamsText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        margin: 0,
    },
    // History styles
    shiftCount: {
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '300',
        marginLeft: '10px',
    },
    shiftsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    shiftItem: {
        background: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
        padding: '15px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
    },
    shiftItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    shiftTypeBadge: {
        padding: '5px 12px',
        borderRadius: '15px',
        color: '#ffffff',
        fontSize: '0.8rem',
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    editButton: {
        padding: '6px 12px',
        borderRadius: '8px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        fontSize: '0.8rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginRight: '10px',
    },
    shiftItemDetails: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '8px',
    },
    shiftDetailRow: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    shiftDetailLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
    },
    shiftDetailValue: {
        color: '#ffffff',
        fontSize: '0.85rem',
        fontFamily: "'JetBrains Mono', monospace",
    },
    loadMoreButton: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
        marginTop: '20px',
        width: '100%',
    },
    // Modal styles
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    modal: {
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '20px',
        padding: '25px',
        maxWidth: '500px',
        width: '100%',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    modalTitle: {
        color: '#ffffff',
        fontSize: '1.2rem',
        marginBottom: '20px',
        marginTop: 0,
    },
    editFormGroup: {
        marginBottom: '20px',
    },
    editLabel: {
        display: 'block',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        marginBottom: '8px',
    },
    editInput: {
        width: '100%',
        padding: '12px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.3)',
        color: '#ffffff',
        fontSize: '1rem',
        fontFamily: "'JetBrains Mono', monospace",
        boxSizing: 'border-box',
    },
    editTypeSelector: {
        display: 'flex',
        gap: '8px',
    },
    editTypeButton: {
        flex: 1,
        padding: '10px',
        borderRadius: '10px',
        border: 'none',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '0.85rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textTransform: 'capitalize',
    },
    editTypeButtonRemote: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
    },
    editTypeButtonOffice: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        color: '#ffffff',
    },
    editTypeButtonOff: {
        background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
        color: '#ffffff',
    },
    modalButtons: {
        display: 'flex',
        gap: '15px',
        marginTop: '25px',
    },
    cancelButton: {
        background: 'rgba(255, 255, 255, 0.1)',
        color: '#ffffff',
    },
};

// Add responsive styles
const mediaQuery = window.matchMedia('(max-width: 600px)');
if (mediaQuery.matches) {
    styles.timerGrid.gridTemplateColumns = '1fr';
    styles.statsGrid.gridTemplateColumns = '1fr';
    styles.percentageGrid.gridTemplateColumns = 'repeat(2, 1fr)';
    styles.weekStatsGrid.gridTemplateColumns = '1fr';
    styles.progressStatsGrid.gridTemplateColumns = '1fr';
    styles.expectedGrid.gridTemplateColumns = '1fr';
    styles.scheduleGrid.gridTemplateColumns = 'repeat(4, 1fr)';
    styles.shiftItemDetails.gridTemplateColumns = '1fr';
    styles.editTypeSelector.flexDirection = 'column';
}

// Show tab labels on larger screens
const tabMediaQuery = window.matchMedia('(min-width: 500px)');
if (tabMediaQuery.matches) {
    styles.tabLabel.display = 'inline';
}

export default Shift;
