import React, { useState, useEffect } from 'react';

const Alert = ({ message, type, onClose, timeout = 2000 }) => {

    // Auto-dismiss the alert after 3 seconds
    useEffect(() => {
        const removeTimer = setTimeout(() => {
            onClose(); // Remove the alert completely after the fade-out ends
        }, timeout);

        return () => {
            clearTimeout(removeTimer);
        };
    }, [onClose]);

    return (
        <div className={`alert alert-${type} elementToFadeInAndOut`}>
            <span>{message}</span>
            <button className="alert-close" onClick={() => onClose()}>&times;</button>
        </div>
    );
};

export default Alert;
