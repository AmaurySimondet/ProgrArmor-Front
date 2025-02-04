import React from 'react';


const CompteStats = ({ stats }) => {

    return (<div>
        <p style={{ margin: '0 20px' }}> 3 derniers mois: </p>
        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', padding: '10px' }}>
            <div>
                <h3> Séances </h3>
                <div> {stats?.seances} </div>
            </div>
            <div>
                <h3> Top exercices </h3>
                <div>
                    {Array.isArray(stats?.topExercices) ?
                        stats.topExercices.slice(0, 3).map((exercise, index) => (
                            <div key={exercise._id} style={{ color: index % 2 === 0 ? 'black' : 'grey', fontSize: '12px' }}>
                                {exercise.fullName}
                            </div>
                        ))
                        : null
                    }
                </div>
            </div>
            <div>
                <h3> Jour préféré </h3>
                <div> {stats?.favoriteDay} </div>
            </div>
            <div>
                <h3> PRs </h3>
                <div> {stats?.prs} </div>
            </div>
        </div>

    </div>);
};

export default CompteStats;