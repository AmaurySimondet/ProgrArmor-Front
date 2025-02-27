import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { dateToString } from '../../utils/dates';

const SeanceDateChoice = ({ onNext, onBack }) => {
    const [customDate, setCustomDate] = useState(new Date());
    const { width } = useWindowDimensions();

    const handleTodayChoice = () => {
        onNext(dateToString(new Date()));
    };

    const handleYesterdayChoice = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        onNext(dateToString(yesterday));
    };

    const handlePreYesterdayChoice = () => {
        const preYesterday = new Date();
        preYesterday.setDate(preYesterday.getDate() - 2);
        onNext(dateToString(preYesterday));
    };

    const handleCustomDateSubmit = () => {
        if (customDate) {
            onNext(dateToString(customDate));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCustomDateSubmit();
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1>C'était quand ?</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div
                    onClick={handleTodayChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>📅</div>
                    <div>Aujourd'hui</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div
                    onClick={handleYesterdayChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>🗓️</div>
                    <div>Hier</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div
                    className='sessionChoice'
                    onClick={handlePreYesterdayChoice}
                >
                    <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>📆</div>
                    <div>Avant-hier</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {new Date(new Date().setDate(new Date().getDate() - 2)).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                <div className='sessionChoice' style={{ backgroundColor: '#CCCCCC', padding: '20px', width: '300px' }}>
                    <DatePicker
                        selected={customDate}
                        onChange={(date) => setCustomDate(date)}
                        dateFormat={"yyyy-MM-dd"}
                        placeholderText="Select a date"
                        className="custom-date-picker" // Apply custom class for styling
                        calendarClassName="custom-calendar" // Optional custom calendar class
                        onKeyDown={handleKeyDown}
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
