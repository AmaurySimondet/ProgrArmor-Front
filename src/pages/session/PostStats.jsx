import React from 'react';
import { COLORS } from '../../utils/constants';

const PostStats = ({ recordSummary, stats, width }) => {

    const statStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '7px',
    };

    const containerStyle = {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
    };

    const statsRowStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: width < 500 ? '0px' : '5px',
        justifyContent: 'center',
    };

    const spanStyle = {
        fontSize: width < 500 ? '0.8rem' : '1rem',
        color: '#666'
    };

    const h3Style = {
        margin: '0px 0',
        fontSize: width < 500 ? '0.8rem' : '1.1rem'
    };

    return (
        <div style={containerStyle}>
            <div style={statsRowStyle}>
                <div style={statStyle}>
                    <span style={spanStyle}>Sets</span>
                    <h3 style={h3Style}>{stats.nSets}</h3>
                </div>
                {/* <div style={statStyle}>
                    <span style={spanStyle}>Reps/Secs</span>
                    <h3 style={h3Style}>{stats.nReps}</h3>
                </div> */}
                <div style={statStyle}>
                    <span style={spanStyle}>Reps/Secs</span>
                    <h3 style={h3Style}>{stats.intervalReps}</h3>
                </div>
                {/* <div style={statStyle}>
                    <span style={spanStyle}>Charge</span>
                    <h3 style={h3Style}>{stats.totalWeight}kg</h3>
                </div> */}
                <div style={statStyle}>
                    <span style={spanStyle}>Charge</span>
                    <h3 style={h3Style}>{stats.intervalWeight}kg</h3>
                </div>
            </div>

            {recordSummary && recordSummary.length > 0 && (
                <div style={statsRowStyle}>
                    {recordSummary.map((record, idx) => (
                        <div key={idx} style={statStyle}>
                            <li
                                className={`${record.PR ? 'personal-record' : ''}`.trim()}
                                style={{
                                    display: 'inline-block',
                                    margin: '0 5px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    ...(record.PR === 'PR'
                                        ? { backgroundColor: COLORS.PR.background, border: `2px solid ${COLORS.PR.border}` }
                                        : record.PR === "SB"
                                            ? { backgroundColor: COLORS.SB.background, border: `2px solid ${COLORS.SB.border}` }
                                            : record.PR === "NB"
                                                ? { backgroundColor: COLORS.NB.background, border: `2px solid ${COLORS.NB.border}` }
                                                : {})
                                }}>
                                <span className="pr-badge"
                                    style={record.PR === 'PR'
                                        ? { color: COLORS.PR.text, margin: 0, fontSize: "14px" }
                                        : record.PR === "SB"
                                            ? { color: COLORS.SB.text, margin: 0, fontSize: "14px" }
                                            : record.PR === "NB"
                                                ? { color: COLORS.NB.text, margin: 0, fontSize: "14px" }
                                                : { color: "#666", margin: 0, fontSize: "14px" }}>
                                    {record.PR} x {record.number}
                                </span>
                            </li>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostStats;