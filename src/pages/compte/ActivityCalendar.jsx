import React, { useState } from 'react';
import { COLORS } from '../../utils/constants';

const ActivityCalendar = ({ regularityScore }) => {
    const [activeFilter, setActiveFilter] = useState(null);

    // Get dates of last four weeks
    let datesOfLastFourWeeks = [];
    const today = new Date();
    const mondayThisWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // +1 to start from Monday
    const mondayNextWeek = new Date(mondayThisWeek);
    mondayNextWeek.setDate(mondayThisWeek.getDate() + 7);
    const mondayFourWeeksAgo = new Date(mondayNextWeek);
    mondayFourWeeksAgo.setDate(mondayNextWeek.getDate() - 28);

    // Get seances from last four weeks
    const seances = regularityScore.seances.filter(seance => {
        const seanceDate = new Date(seance.date);
        return seanceDate >= mondayFourWeeksAgo;
    });

    // Fill array with dates from mondayFourWeeksAgo to mondayThisWeek
    for (let i = 0; i < 28; i++) {
        const date = new Date(mondayFourWeeksAgo);
        date.setDate(mondayFourWeeksAgo.getDate() + i);
        datesOfLastFourWeeks.push(date);
    }

    // Get unique seance names and create color mapping automatically
    const uniqueSeanceNames = [...new Set(seances.map(s => s.name))];
    const colorMapping = Object.fromEntries(
        uniqueSeanceNames.map((name, index) => [
            name,
            COLORS.calendarSeanceNameColors[index % COLORS.calendarSeanceNameColors.length]
        ])
    );

    // Group dates by weeks (4 rows)
    const weeks = [];
    let currentWeek = [];
    datesOfLastFourWeeks.forEach(date => {
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
        currentWeek.push(date);
    });
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Filter seances based on activeFilter
    const filteredSeances = activeFilter
        ? seances.filter(seance => seance.name === activeFilter)
        : seances;

    // Update getSeanceForDate to use filtered seances
    const getSeanceForDate = (date) => {
        return filteredSeances.find(seance =>
            new Date(seance.date).toDateString() === date.toDateString()
        );
    };

    const daysTitle = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

    return (
        <div>
            <div className="activity-calendar-container">
                <div className="activity-calendar">
                    <table style={{ width: '100%' }}>
                        <caption className="vh">4 dernières semaines</caption>
                        <caption className="vh"> <i>Cliquez sur une séance pour obtenir plus d'informations</i></caption>
                        <thead>
                            <tr>
                                {daysTitle.map((weekday, index) => (
                                    <th key={weekday} scope="col">
                                        <div className="weekday">{weekday}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {weeks.map((week, weekIndex) => (
                                <tr key={week}>
                                    {week.map((date, dayIndex) => {
                                        const seance = getSeanceForDate(date);
                                        const color = seance
                                            ? (colorMapping[seance.name])
                                            : 'transparent';

                                        return (
                                            <td key={date.toDateString()} style={{ justifyItems: 'center' }}>
                                                <div
                                                    className={`day-circle ${seance ? 'has-seance' : ''}`}
                                                    style={{
                                                        backgroundColor: color,
                                                        border: date.toDateString() == new Date().toDateString() ? '2px solid #9b0000' : '1px solid #ddd'
                                                    }}
                                                    onClick={() => {
                                                        window.location.href = `/seance?id=${seance._id}`;
                                                    }}
                                                >
                                                    {seance ? (
                                                        <span className="tooltiptext">
                                                            {date.toLocaleDateString()}<br />
                                                            {seance.name}<br />
                                                            {date.toDateString() == new Date().toDateString() ? 'Aujourd\'hui' : ''}
                                                        </span>
                                                    ) : (
                                                        <span className="tooltiptext">
                                                            {date.toLocaleDateString()}<br />
                                                            {date.toDateString() == new Date().toDateString() ? 'Aujourd\'hui' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="activity-legend">
                    {activeFilter && (
                        <button
                            className="reset-filter popInElement"
                            onClick={() => setActiveFilter(null)}
                        >
                            Voir toutes les séances
                        </button>
                    )}
                    <ul>
                        {uniqueSeanceNames.map((name, index) => (
                            <li key={name}>
                                <span
                                    className={`day-circle ${activeFilter === name ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: colorMapping[name],
                                        flexShrink: 0,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setActiveFilter(name)}
                                />
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .activity-calendar-container {
                    display: flex;
                    gap: 40px;
                    width: 75vw;
                    margin: 40px auto;
                }

                .activity-calendar {
                    width: 80%;
                }
                
                .activity-calendar table {
                    border-spacing: 4px;
                    border-collapse: separate;
                }
                
                .day-circle {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    position: relative;
                    transition: all 0.2s ease-in-out;
                }

                .day-circle:hover {
                    transform: scale(1.2);
                }
                
                .day-circle .tooltiptext {
                    visibility: hidden;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: #fff;
                    text-align: center;
                    padding: 5px;
                    border-radius: 6px;
                    position: absolute;
                    z-index: 1;
                    width: 200px;
                    bottom: 125%;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 12px;
                    white-space: nowrap;
                }
                
                .day-circle:hover .tooltiptext {
                    visibility: visible;
                }
                
                /* Add a small arrow to the tooltip */
                .day-circle .tooltiptext::after {
                    content: "";
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -5px;
                    border-width: 5px;
                    border-style: solid;
                    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
                }
                
                .activity-legend ul {
                    list-style: none;
                    padding: 0;
                }
                
                .activity-legend li {
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .reset-filter {
                    margin-bottom: 16px;
                    padding: 8px 16px;
                    background-color: #f0f0f0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .reset-filter:hover {
                    background-color: #e0e0e0;
                }

                .day-circle.active {
                    transform: scale(1.2);
                    box-shadow: 0 0 0 2px #000;
                }
            `}</style>
        </div>
    );
};

export default ActivityCalendar;