import React from 'react';

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
                <div style={{
                    textAlign: 'center',
                    minWidth: 'fit-content'
                }}>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {recordSummary.map((record, idx) => (
                            <li key={record.PR}
                                className={`${record.PR ? 'personal-record' : ''}`.trim()}
                                style={{
                                    display: 'inline-block',
                                    margin: '0 5px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    ...(record.PR === 'PR'
                                        ? { backgroundColor: "#e0ffe0", border: "2px solid #00c853" }
                                        : record.PR === "SB"
                                            ? { backgroundColor: "#fff9c4", border: "2px solid #ffeb3b" }
                                            : {})
                                }}>
                                <span className="pr-badge"
                                    style={record.PR === 'PR'
                                        ? { color: "#00c853", margin: 0, fontSize: "14px" }
                                        : { color: "rgb(255 178 59)", margin: 0, fontSize: "14px" }}>
                                    {record.PR} x {record.number}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PostStats;