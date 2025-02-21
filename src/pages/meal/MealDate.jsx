import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { dateToString } from '../../utils/dates';

const MealDate = ({ onNext, onBack }) => {
    const [customDateTime, setCustomDateTime] = useState(new Date());
    const { width } = useWindowDimensions();

    const handleNowChoice = () => {
        onNext(dateToString(new Date()));
    };

    const formatDateTime = (date) => {
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCustomDateTimeSubmit = () => {
        if (customDateTime) {
            onNext(dateToString(customDateTime));
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleCustomDateTimeSubmit();
        }
    };

    return (
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px', textAlign: 'center' }} className='popInElement'>
            <h1
                style={{ color: '#9b0000', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}
            >
                <span onClick={onBack} style={{ cursor: 'pointer' }} className="clickable">&lt; Retour</span>
            </h1>
            <h1>Choisir la date et l'heure du repas</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div
                    onClick={handleNowChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '18px' : '36px' }}>🕐</div>
                    <div>Maintenant</div>
                    <div style={{ fontSize: '0.66rem' }}>
                        {formatDateTime(new Date())}
                    </div>
                </div>
                <div className='sessionChoice' style={{ backgroundColor: '#CCCCCC', padding: '20px', width: '300px' }}>
                    <DatePicker
                        selected={customDateTime}
                        onChange={(date) => setCustomDateTime(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="yyyy-MM-dd HH:mm"
                        placeholderText="Sélectionner date et heure"
                        className="custom-date-picker"
                        calendarClassName="custom-calendar"
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleCustomDateTimeSubmit}
                        className='btn btn-white'
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MealDate; 