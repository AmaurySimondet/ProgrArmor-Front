import React, { useState, useEffect } from 'react';
import { formatTime } from '../utils/dates';
import Picker from 'react-mobile-picker';

const DEFAULT_MINUTES = 2;
const DEFAULT_SECONDS = 0;

// Add time selection options
const timeSelections = {
    minutes: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0')),
    seconds: Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))
};

const Chrono = () => {
    // Add state for picker
    const [showPicker, setShowPicker] = useState(false);
    const [pickerValue, setPickerValue] = useState({
        minutes: DEFAULT_MINUTES,
        seconds: DEFAULT_SECONDS
    });

    // Modified time state to use picker values
    const [time, setTime] = useState(() => {
        const saved = localStorage.getItem('chronoTime');
        const initialValue = JSON.parse(saved);
        return initialValue || 0;
    });
    const [isRunning, setIsRunning] = useState(() => {
        const saved = localStorage.getItem('chronoIsRunning');
        return JSON.parse(saved) || false;
    });

    useEffect(() => {
        let interval;
        if (isRunning && time > 0) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    const newTime = prevTime - 1;
                    localStorage.setItem('chronoTime', JSON.stringify(newTime));

                    // When timer reaches 0
                    if (newTime === 0) {
                        setIsRunning(false);
                        alert('Fin du chrono, let\'s go !');
                    }

                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        localStorage.setItem('chronoIsRunning', JSON.stringify(isRunning));
    }, [isRunning]);

    const handleStart = () => {
        if (time > 0) {
            setIsRunning(true);
        }
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setShowPicker(true);
        setIsRunning(false);
        localStorage.setItem('chronoIsRunning', 'false');
    };

    const handleTimeSelect = () => {
        const newTime = (parseInt(pickerValue.minutes) * 60) + parseInt(pickerValue.seconds);
        setTime(newTime);
        setShowPicker(false);
        localStorage.setItem('chronoTime', JSON.stringify(newTime));
        setIsRunning(true);
    };

    // logs
    useEffect(() => {
        console.log(time);
    }, [time]);

    // Add console log to debug
    useEffect(() => {
        console.log('showPicker:', showPicker);
    }, [showPicker]);

    return (
        <div className="chrono-container">
            <h2
                className="time-display"
                onClick={() => {
                    console.log('time display clicked');
                    if (!isRunning) {
                        setShowPicker(true);
                    }
                }}
            >
                {formatTime(time)}
            </h2>

            {showPicker && !isRunning && (
                <div className="picker-container">
                    <Picker
                        value={pickerValue}
                        onChange={setPickerValue}
                        height={200}
                        wheelMode="natural"
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            width: '100%'
                        }}
                    >
                        <h2>Minutes</h2>
                        <Picker.Column name="minutes">
                            {timeSelections.minutes.map(value => (
                                <Picker.Item key={value} value={value}>
                                    {value}
                                </Picker.Item>
                            ))}
                        </Picker.Column>
                        <h2>Secondes</h2>
                        <Picker.Column name="seconds">
                            {timeSelections.seconds.map(value => (
                                <Picker.Item key={value} value={value}>
                                    {value}
                                </Picker.Item>
                            ))}
                        </Picker.Column>
                    </Picker>
                    <button className="btn btn-dark" onClick={handleTimeSelect}>Start</button>
                </div>
            )}

            <div className="basicFlex">
                {!isRunning ? (
                    <button onClick={handleStart} className="btn btn-dark" disabled={time === 0}>Start</button>
                ) : (
                    <button onClick={handleStop} className="btn btn-black">Stop</button>
                )}
                <button onClick={handleReset} className="btn btn-white">Reset</button>
            </div>
        </div>
    );
};

export default Chrono; 