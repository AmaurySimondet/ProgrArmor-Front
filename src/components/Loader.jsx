import React from 'react';
import { COLORS } from '../utils/colors';

const Loader = () => {
    return (
        <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="loader"></div>
        </div>
    );
};

export default Loader;
