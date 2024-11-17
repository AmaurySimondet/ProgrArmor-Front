import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SeanceDateChoice = ({ onNext, onBack }) => {
    const [customDate, setCustomDate] = useState('');
    const { width } = useWindowDimensions();

    const handleTodayChoice = () => {
        onNext(new Date().toISOString().split('T')[0]);
    };

    const handleYesterdayChoice = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        onNext(yesterday.toISOString().split('T')[0]);
    };

    const handlePreYesterdayChoice = () => {
        const preYesterday = new Date();
        preYesterday.setDate(preYesterday.getDate() - 2);
        onNext(preYesterday.toISOString().split('T')[0]);
    };

    const handleCustomDateChange = (e) => {
        setCustomDate(e.target.value);
    };

    const handleCustomDateSubmit = () => {
        if (customDate.trim()) {
            onNext(customDate);
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h2
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h2>
            <h1>Choisir la date de la séance</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div
                    onClick={handleTodayChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>📅</div>
                    <div>Aujourd'hui</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div
                    onClick={handleYesterdayChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🗓️</div>
                    <div>Hier</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div
                    className='sessionChoice'
                    onClick={handlePreYesterdayChoice}
                >
                    <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>📆</div>
                    <div>Avant-hier</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div className='sessionChoice' style={{ backgroundColor: '#CCCCCC', padding: '20px', width: '300px' }}>
                    <DatePicker
                        selected={customDate}
                        onChange={handleCustomDateChange}
                        placeholderText="Select a date"
                        dateFormat="dd/MM/yyyy"
                        className="custom-date-picker" // Apply custom class for styling
                        calendarClassName="custom-calendar" // Optional custom calendar class
                    />
                    <button
                        onClick={handleCustomDateSubmit}
                        className='btn btn-white'
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeanceDateChoice;
