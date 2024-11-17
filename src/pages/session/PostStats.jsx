import React from 'react';
import { useWindowDimensions } from '../../utils/useEffect';

const PostStats = ({ stats }) => {
    const { width } = useWindowDimensions();

    return (<div>
        {width > 500 ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <span> Sets</span>
                    <h3> {stats.nSets} </h3>
                </div>
                <div>
                    <span>Reps/Secs</span>
                    <h3> {stats.nReps} </h3>
                </div>
                <div>
                    <span> Interval</span>
                    <h3> {stats.intervalReps} </h3>
                </div>
                <div>
                    <span> Charge </span>
                    <h3> {stats.totalWeight}kg </h3>
                </div>
                <div>
                    <span> Interval</span>
                    <h3> {stats.intervalWeight}kg </h3>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <div>
                        <span> Sets</span>
                        <h3> {stats.nSets} </h3>
                    </div>
                    <div>
                        <span>Reps/Secs</span>
                        <h3> {stats.nReps} </h3>
                    </div>
                    <div>
                        <span> Interval</span>
                        <h3> {stats.intervalReps} </h3>
                    </div>
                </div>
                <div>
                    <div>
                        <span> Charge </span>
                        <h3> {stats.totalWeight}kg </h3>
                    </div>
                    <div>
                        <span> Interval</span>
                        <h3> {stats.intervalWeight}kg </h3>
                    </div>
                </div>
            </div>
        )}
    </div>);
};

export default PostStats;