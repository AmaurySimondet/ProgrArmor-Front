import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from '../../utils/useEffect';
import API from '../../utils/API';
import Loader from '../../components/Loader';
import apiCalls from '../../utils/apiCalls';


const CompteStats = (user) => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        API.getStats(user.user).then(async res => {
            const favoriteExercices = await apiCalls.buildFavoriteExercices(res.data.stats.topExercices);
            const formattedStats = {
                seances: res.data.stats.seances || 0,
                topExercices: favoriteExercices ? favoriteExercices.slice(0, 3).map(ex =>
                    ex.categories.length > 0 ?
                        `${ex.exercice.name.fr} - ${ex.categories.map(cat => cat.category.name.fr).join(', ')}` :
                        `${ex.exercice.name.fr}`
                ) : 'N/A',
                prs: res.data.stats.prs || 0,
                favoriteDay: res.data.stats.favoriteDay || 'N/A'
            };
            console.log(formattedStats);
            setStats(formattedStats);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <Loader />
    }

    return (<div>
        {width > 500 ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px' }}>
                <div> 3 derniers mois </div>
                <div>
                    <h3> Séances </h3>
                    <div> {stats?.seances} </div>
                </div>
                <div>
                    <h3> Top exercices </h3>
                    <div>
                        {Array.isArray(stats?.topExercices) ?
                            stats.topExercices.map((exercise, index) => (
                                <div key={index}>{exercise}</div>
                            ))
                            : stats?.topExercices
                        }
                    </div>
                </div>
                <div>
                    <h3> PRs </h3>
                    <div> {stats?.prs} </div>
                </div>
                <div>
                    <h3> Jour préféré </h3>
                    <div> {stats?.favoriteDay} </div>
                </div>
            </div>
        ) : (
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', marginBottom: '20px' }}>
                <div>
                    <div> 3 derniers mois </div>
                    <div>
                        <h3> Séances </h3>
                        <div> {stats?.seances} </div>
                    </div>
                    <div>
                        <h3> Top exercices </h3>
                        <div>
                            {Array.isArray(stats?.topExercices) ?
                                stats.topExercices.map((exercise, index) => (
                                    <div key={index}>{exercise}</div>
                                ))
                                : stats?.topExercices
                            }
                        </div>
                    </div>
                    <div>
                        <h3> PRs </h3>
                        <div> {stats?.prs} </div>
                    </div>
                </div>
                <div>
                    <div>
                        <h3> Jour préféré </h3>
                        <div> {stats?.favoriteDay} </div>
                    </div>
                </div>
            </div>
        )}
    </div>);
};

export default CompteStats;