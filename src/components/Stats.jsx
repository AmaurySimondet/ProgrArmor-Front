import { React, useState, useEffect } from "react";
import { XAxis, CartesianGrid, Line, ResponsiveContainer, Bar, ComposedChart, Legend } from 'recharts';
import API from "../utils/API.js";
import { Loader } from "./Loader.jsx";
import { dateBasedOnTimeframe } from "../utils/dates.js";
import { useWindowDimensions } from "../utils/useEffect.js";
import { COLORS } from "../utils/constants.js";
import { useSearchParams } from "react-router-dom";
import ActivityCalendar from "../pages/compte/ActivityCalendar.jsx";
import PrTable from "../pages/compte/PrTable.jsx";
import { calculateMovingAverage } from "../utils/maths.js";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{ color: "grey" }}>
            {label && <p className="chart-desc">Date: {label}</p>}
            {payload.map((item, index) => (
                <p key={index} className="chart-desc">
                    {item.name === 'date' ? 'Date' :
                        item.name === 'Reps / Secs' ?
                            (payload[0].payload.unit === 'repetitions' ? 'Repetitions' : 'Secondes') :
                            item.name}: {item.value}
                </p>
            ))}
            {/* Add elastic use information if it exists in the payload */}
            {payload[0]?.payload?.elastic?.use &&
                <p className="chart-desc">
                    Utilisation: {payload[0].payload.elastic.use}
                </p>
            }
        </div>
    );
};

function Stats({ stats, userId, subTab }) {
    const [workoutDataTopExercices, setWorkoutDataTopExercices] = useState([]);
    const [opacity, setOpacity] = useState({
        value: 0.4,
        weightLoad: 1,
        'elastic.tension': 1,
        valueMovingAverage: 0.2,
        weightLoadMovingAverage: 0.2
    });
    const [regularityScore, setRegularityScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(0); // Default to first exercise
    const [selectedTimeframe, setSelectedTimeframe] = useState('max'); // Default to 3 months
    const [prTableResults, setPrTableResults] = useState(null);
    const { width } = useWindowDimensions();
    const [selectedExerciseId, setSelectedExerciseId] = useState(null);
    const [selectedCategoriesIds, setSelectedCategoriesIds] = useState(null);
    const [searchParams] = useSearchParams();
    const [hoveredData, setHoveredData] = useState(null);

    // const handleMouseEnter = (o) => {
    //     const { dataKey } = o;

    //     setOpacity((op) => {
    //         const newOpacity = { ...op };
    //         // Set all keys to 0.5 except the hovered one
    //         Object.keys(newOpacity).forEach(key => {
    //             newOpacity[key] = key === dataKey ? 1 : 0.5;
    //         });
    //         return newOpacity;
    //     });
    // };

    // const handleMouseLeave = (o) => {
    //     const { dataKey } = o;

    //     setOpacity((op) => {
    //         const newOpacity = { ...op };
    //         // Reset all opacities to 1
    //         Object.keys(newOpacity).forEach(key => {
    //             newOpacity[key] = 1;
    //         });
    //         return newOpacity;
    //     });
    // };

    const handlePrTable = async () => {
        const PrTableQuery = {
            exercice: selectedExerciseId,
            categories: selectedCategoriesIds.map(id => ({ category: id })),
            userId: userId,
            dateMin: dateBasedOnTimeframe(selectedTimeframe).toISOString()
        };

        try {
            const response = await API.getPRs(PrTableQuery);
            setPrTableResults(response.data.prs);
        } catch (error) {
            console.error("Error fetching PRs:", error);
        }
    };

    const handleRegularityScore = async () => {
        const regularityScore = await API.getRegularityScore(userId);
        setRegularityScore(regularityScore.data);
    };

    useEffect(() => {
        const exerciceParam = searchParams.get('exercice');
        const categoriesParam = searchParams.get('categories');

        if (exerciceParam) {
            // Find all exercises that match the exerciceParam
            const matchingExercises = stats.topExercices.filter(ex =>
                ex.exercice._id === exerciceParam
            );

            if (matchingExercises.length > 0) {
                // If we have categoriesParam, find exact match in stats.topExercices
                if (categoriesParam) {
                    const exactMatch = stats.topExercices.findIndex(ex =>
                        ex.exercice._id === exerciceParam &&
                        ex.categories.some(cat => cat.category._id === categoriesParam)
                    );
                    if (exactMatch !== -1) {
                        setSelectedExercise(exactMatch);
                        setSelectedExerciseId(exerciceParam);
                        setSelectedCategoriesIds([categoriesParam]);
                        return;
                    }
                }

                // If no categoriesParam or no exact match, use first matching exercise
                const firstMatchIndex = stats.topExercices.indexOf(matchingExercises[0]);
                setSelectedExercise(firstMatchIndex);
                setSelectedExerciseId(exerciceParam);
                setSelectedCategoriesIds(matchingExercises[0].categories.map(cat => cat.category._id));
            }
        } else {
            // Use default values from the first exercise
            setSelectedExerciseId(stats.topExercices[0]?.exercice?._id);
            setSelectedCategoriesIds(stats.topExercices[0]?.categories?.map(cat => cat.category._id));
        }
    }, []); // Run once on component mount

    useEffect(() => {
        setSelectedExerciseId(stats.topExercices[selectedExercise]?.exercice?._id);
        setSelectedCategoriesIds(stats.topExercices[selectedExercise]?.categories?.map(cat => cat.category._id));
    }, [selectedExercise]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await handlePrTable();
                await handleRegularityScore();

                const exerciceData = [];
                const dateMin = dateBasedOnTimeframe(selectedTimeframe);

                let topExerciceSets = await API.getSeanceSets({
                    userId: userId,
                    exercice: selectedExerciseId,
                    categories: selectedCategoriesIds.map(id => ({ category: id })),
                    dateMin: dateMin.toISOString()
                });

                if (topExerciceSets.data.sets.length === 0) {
                    topExerciceSets = await API.getSeanceSets({
                        userId: userId,
                        exercice: selectedExerciseId,
                        categories: selectedCategoriesIds.map(id => ({ category: id })),
                        dateMin: new Date(0).toISOString()
                    });
                    setSelectedTimeframe('max');
                }

                // Calculate moving averages
                const valueMovingAverage = calculateMovingAverage(topExerciceSets.data.sets, 'value');
                const weightLoadMovingAverage = calculateMovingAverage(topExerciceSets.data.sets, 'weightLoad');

                // Add moving averages to each data point
                const processedData = topExerciceSets.data.sets.map(data => {
                    const valueAvg = valueMovingAverage.find(avg => avg.date === data.date)?.average;
                    const weightLoadAvg = weightLoadMovingAverage.find(avg => avg.date === data.date)?.average;

                    return {
                        ...data,
                        valueMovingAverage: valueAvg,
                        weightLoadMovingAverage: weightLoadAvg
                    };
                });

                exerciceData.push(processedData);
                setWorkoutDataTopExercices(exerciceData);

                // Set hoveredData to the last set if there are any sets
                if (processedData.length > 0) {
                    setHoveredData({ ...processedData[processedData.length - 1], date: new Date(processedData[processedData.length - 1].date).toLocaleDateString('fr-FR') });
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedExerciseId && selectedCategoriesIds) {
            fetchData();
        }
    }, [selectedExercise, selectedTimeframe, selectedExerciseId, selectedCategoriesIds]);

    // Split the component into two main sections
    const RegularityStats = () => {
        if (!regularityScore) return null;

        return (
            <section className="stats-section popInElement" style={{ display: "flex", margin: 0, padding: "5px", flexDirection: "column", gap: "0", alignItems: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <h2>Régularité d'entraînement</h2>
                    <i>3 derniers mois</i>
                </div>

                <ActivityCalendar regularityScore={regularityScore} />
                <div className="stats-grid" style={{ display: "flex", flexDirection: "column", gap: "0", width: "100%" }}>
                    <div className="stat-item" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                        <h2 style={{
                            color: regularityScore.average * 100 >= 80 ? '#28a745' :
                                regularityScore.average * 100 >= 60 ? '#90EE90' :
                                    regularityScore.average * 100 >= 40 ? '#ffa500' :
                                        regularityScore.average * 100 >= 20 ? '#dc3545' :
                                            '#000000'
                        }}>
                            {(regularityScore.average * 100).toFixed(2)} %
                        </h2>
                        <p>Des semaines avec une séance ({regularityScore.uniqueWeeks} / {regularityScore.totalWeeksSinceFirstWorkout})</p>
                        <p style={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                            {regularityScore.average * 100 >= 80 ? "Tu es exemplaire !" :
                                regularityScore.average * 100 >= 60 ? "Tu as une belle regularité !" :
                                    regularityScore.average * 100 >= 40 ? "Allez, tu peux mieux faire !" :
                                        regularityScore.average * 100 >= 20 ? "Un soucis ? Tes amis et un coach peuvent t'aider à te remotiver !" :
                                            "Revient t'entraîner !"}
                        </p>
                    </div>
                    <div className="stat-item" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                        <h3>Série actuelle</h3>
                        <p>{regularityScore.currentStreak} semaines</p>
                    </div>
                    <div className="stat-item" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                        <h3>Meilleure série</h3>
                        <p>{regularityScore.bestStreak} semaines</p>
                    </div>
                </div>
            </section>
        );
    };

    const handleMouseMove = (data) => {
        if (data && data.activePayload) {
            setHoveredData(data.activePayload[0].payload);
        } else {
            setHoveredData(null);
        }
    };

    const ExerciseStats = () => {
        if (!stats.topExercices.length) return null;

        return (
            <div className="stats-container">
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Statistiques d'exercice</h2>
                <div className="exercise-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <select
                        value={selectedExercise}
                        className="form-control"
                        onChange={(e) => {
                            setSelectedExercise(parseInt(e.target.value));
                            setSelectedTimeframe('max');
                        }}
                        style={{ width: '70%' }}
                    >
                        {stats.topExercices.map((exercise, index) => (
                            <option key={Math.random()} value={index}>
                                {exercise.fullName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedTimeframe}
                        className="form-control"
                        onChange={(e) => {
                            setSelectedTimeframe(e.target.value);
                        }}
                        style={{ width: '30%' }}
                    >
                        <option value="3m">3 mois</option>
                        <option value="1y">1 an</option>
                        <option value="max">Max</option>
                    </select>
                </div>

                <div>
                    <h2 style={{ color: 'grey' }}>
                        <span style={{ color: 'black' }}>
                            {hoveredData ? hoveredData.value : '-'}
                        </span>
                        <span>{' x '}</span>
                        <span style={{ color: '#9b0000' }}>
                            {hoveredData ? hoveredData.weightLoad : '-'}
                        </span>
                        <span>{' kg'}</span>
                        {hoveredData?.elastic?.use &&
                            hoveredData?.elastic?.use === 'resistance' ? (
                            <span style={{ color: 'red' }}>{' + ' + hoveredData?.elastic?.tension + ' kg'}</span>
                        ) : hoveredData?.elastic?.use === 'assistance' ? (
                            <span style={{ color: 'green' }}>{' - ' + hoveredData?.elastic?.tension + ' kg'}</span>
                        ) : null
                        }
                    </h2>
                    <p style={{ color: 'grey' }}>
                        {hoveredData ? hoveredData.date : '-'}
                    </p>
                </div>

                {/* Workout Progress Chart */}
                {
                    workoutDataTopExercices.map((exerciceData, index) => {
                        // Format dates for exercise data points and multiply value by 10
                        const formattedData = exerciceData.map(data => ({
                            ...data,
                            date: new Date(data.date).toLocaleDateString('fr-FR'),
                        }));

                        return (
                            <div>
                                <section key={Math.random()} className="chart-section">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <ComposedChart
                                            width={400}
                                            height={400}
                                            data={formattedData}
                                            onMouseMove={handleMouseMove}
                                            onMouseLeave={() => setHoveredData(null)}
                                        >
                                            <XAxis dataKey="date" tick={() => null} />
                                            <CartesianGrid stroke="#f5f5f5" />
                                            <Bar name="Reps / Secs" dataKey="value" fill="black" opacity={opacity.value} isAnimationActive={false} />
                                            <Line name="Charge (kg)" type="monotone" dataKey="weightLoad" stroke="#9b0000" strokeOpacity={opacity.weightLoad} dot={false} isAnimationActive={false} />
                                            <Line name="Tension élastique (kg)" type="monotone" dataKey="elastic.tension" stroke="#82ca9d" strokeOpacity={opacity['elastic.tension']} dot={false} isAnimationActive={false} />
                                            <Line name="Moyenne mobile Reps/Secs" type="monotone" dataKey="valueMovingAverage" stroke="#0000BDFF" strokeOpacity={opacity.valueMovingAverage} dot={false} isAnimationActive={false} />
                                            <Line name="Moyenne mobile Charge" type="monotone" dataKey="weightLoadMovingAverage" stroke="#ff0000" strokeOpacity={opacity.weightLoadMovingAverage} dot={false} isAnimationActive={false} />
                                            <Legend />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                </section>
                            </div>
                        );
                    })
                }

                {/* PR Table */}
                {prTableResults && <PrTable PrTableResults={prTableResults} />}
            </div>
        );
    };

    if (loading) return <Loader />;

    return (
        <div>
            {subTab === 'regularity' ? <RegularityStats /> : <ExerciseStats />}
        </div>
    );
}

export default Stats;