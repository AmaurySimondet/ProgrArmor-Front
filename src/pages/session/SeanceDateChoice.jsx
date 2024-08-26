import React, { useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';

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
                </div>
                <div
                    onClick={handleYesterdayChoice}
                    className='sessionChoice'
                >
                    <div style={{ fontSize: width < 500 ? '24px' : '48px' }}>🗓️</div>
                    <div>Hier</div>
                </div>
                <div className='sessionChoice' style={{ backgroundColor: '#CCCCCC', padding: '20px', width: '300px' }}>
                    <input
                        type="date"
                        value={customDate}
                        onChange={handleCustomDateChange}
                        style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
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
