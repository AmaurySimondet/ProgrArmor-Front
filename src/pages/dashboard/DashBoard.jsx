import React, { useState, useEffect } from 'react';
import NavigBar from '../../components/NavigBar';
import Footer from '../../components/Footer';
import { COLORS } from '../../utils/colors';
import DisplaySeancesPost from '../../components/DisplaySeancesPost';
import FollowSuggestions from '../../components/FollowSuggestions';

const DashBoard = () => {

    return (
        <div style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
            <div className="page-container">
                <NavigBar location="dashboard" />




                {/* PAGE CONTENT */}
                <div className="content-wrap">

                    {/* USERS */}
                    <FollowSuggestions userId={localStorage.getItem('userId')} />

                    {/* SEANCES */}
                    <DisplaySeancesPost />
                </div>




                <Footer />
            </div>
        </div>
    );
}

export default DashBoard;
