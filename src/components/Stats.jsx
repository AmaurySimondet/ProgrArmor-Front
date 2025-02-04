import { React, useState, useEffect } from "react";
import { XAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Bar, ComposedChart, Legend } from 'recharts';
import API from "../utils/API.js";
import { Loader } from "./Loader.jsx";
import { dateBasedOnTimeframe } from "../utils/dates.js";
import { useWindowDimensions } from "../utils/useEffect.js";
import { COLORS } from "../utils/constants.js";

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

function Stats({ stats, userId }) {
    const [workoutDataTopExercices, setWorkoutDataTopExercices] = useState([]);
    const [opacity, setOpacity] = useState({
        value: 1,
        weightLoad: 1,
        'elastic.tension': 1
    });
    const [regularityScore, setRegularityScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(0); // Default to first exercise
    const [selectedTimeframe, setSelectedTimeframe] = useState('3m'); // Default to 3 months
    const [prTableResults, setPrTableResults] = useState(null);
    const { width } = useWindowDimensions();

    const handleMouseEnter = (o) => {
        const { dataKey } = o;

        setOpacity((op) => {
            const newOpacity = { ...op };
            // Set all keys to 0.5 except the hovered one
            Object.keys(newOpacity).forEach(key => {
                newOpacity[key] = key === dataKey ? 1 : 0.5;
            });
            return newOpacity;
        });
    };

    const handleMouseLeave = (o) => {
        const { dataKey } = o;

        setOpacity((op) => {
            const newOpacity = { ...op };
            // Reset all opacities to 1
            Object.keys(newOpacity).forEach(key => {
                newOpacity[key] = 1;
            });
            return newOpacity;
        });
    };

    const handlePrTable = async () => {
        const PrTableQuery = {
            exercice: stats.topExercices[selectedExercise].exercice._id,
            categories: stats.topExercices[selectedExercise].categories.map(category => ({ category: category.category._id })),
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

    const PrTableElement = ({ PrTableResults }) => {
        return (
            <div className="popInElement">
                {/* Repetitions Table */}
                <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white', overflowX: 'auto', marginBottom: '20px' }}
                    className="table table-hover table-striped table-bordered">
                    <thead className="thead-white">
                        <tr>
                            <th>{width > 700 ? 'Plage de répétition' : 'Plage'}</th>
                            <th>{width > 700 ? 'Repetitions' : 'Reps'}</th>
                            <th>Charge</th>
                            <th>Elastique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(PrTableResults).map(category => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>{PrTableResults[category].repetitions?.value || '-'}</td>
                                <td>{PrTableResults[category].repetitions?.weightLoad || '-'}</td>
                                <td>{PrTableResults[category].repetitions?.elastic?.use} {PrTableResults[category].repetitions?.elastic?.tension || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Seconds Table */}
                <table border="1" style={{ width: '100%', textAlign: 'center', backgroundColor: 'white', overflowX: 'auto' }}
                    className="table table-hover table-striped table-bordered">
                    <thead className="thead-white">
                        <tr>
                            <th>{width > 700 ? 'Plage temporelle' : 'Plage'}</th>
                            <th>{width > 700 ? 'Secondes' : 'Secs'}</th>
                            <th>Charge</th>
                            <th>Elastique</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(PrTableResults).map(category => (
                            <tr key={category}>
                                <td>{category}</td>
                                <td>{PrTableResults[category].seconds?.value || '-'}</td>
                                <td>{PrTableResults[category].seconds?.weightLoad || '-'}</td>
                                <td>{PrTableResults[category].seconds?.elastic?.use} {PrTableResults[category].seconds?.elastic?.tension || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const handleRegularityScore = async () => {
        const regularityScore = await API.getRegularityScore(userId);
        setRegularityScore(regularityScore.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await handlePrTable();
                await handleRegularityScore();

                const exerciceData = [];
                const dateMin = dateBasedOnTimeframe(selectedTimeframe);

                let topExerciceSets = await API.getSeanceSets({
                    userId: userId,
                    exercice: stats.topExercices[selectedExercise].exercice._id,
                    categories: stats.topExercices[selectedExercise].categories.map(category => { return { category: category.category._id } }),
                    dateMin: dateMin.toISOString()
                });

                if (topExerciceSets.data.sets.length === 0) {
                    topExerciceSets = await API.getSeanceSets({
                        userId: userId,
                        exercice: stats.topExercices[selectedExercise].exercice._id,
                        categories: stats.topExercices[selectedExercise].categories.map(category => { return { category: category.category._id } }),
                        dateMin: new Date(0).toISOString()
                    });
                    setSelectedTimeframe('max');
                }
                exerciceData.push(topExerciceSets.data.sets);

                console.log(exerciceData);
                setWorkoutDataTopExercices(exerciceData);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedExercise, selectedTimeframe]); // Add selectedTimeframe as dependency

    if (loading) return <Loader />;

    return (
        <div className="stats-container popInElement">

            {/* Regularity Score */}
            {regularityScore && (
                <section className="stats-section" style={{ display: "flex", margin: 0, padding: "5px", flexDirection: "column", gap: "0", alignItems: "center" }}>
                    <div style={{ textAlign: "center" }}>
                        <h2>Régularité d'entraînement</h2>
                        <i>3 derniers mois</i>
                    </div>
                    <div className="stats-grid" style={{ display: "flex", flexDirection: "column", gap: "0", width: "100%" }}>
                        <div className="stat-item" style={{ backgroundColor: COLORS.PAGE_BACKGROUND }}>
                            <h2 style={{
                                color: regularityScore.average * 100 >= 80 ? '#28a745' :  // Green
                                    regularityScore.average * 100 >= 60 ? '#90EE90' :  // Light green
                                        regularityScore.average * 100 >= 40 ? '#ffa500' :  // Orange
                                            regularityScore.average * 100 >= 20 ? '#dc3545' :  // Red
                                                '#000000'                                          // Black
                            }}>
                                {(regularityScore.average * 100).toFixed(2)} %
                            </h2>
                            <p>Des semaines avec une séance</p>
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
            )
            }

            {/* Exercise and Timeframe Selection */}
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Statistiques d'exercice</h2>
            <div className="exercise-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select
                    value={selectedExercise}
                    className="form-control"
                    onChange={(e) => {
                        setSelectedExercise(parseInt(e.target.value));
                        setSelectedTimeframe('3m');
                    }}
                    style={{ width: '70%' }}
                >
                    {stats.topExercices.map((exercise, index) => (
                        <option key={index} value={index}>
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
                            <section key={index} className="chart-section">
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart width={400} height={400} data={formattedData}>
                                        <XAxis dataKey="date" tick={() => null} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <CartesianGrid stroke="#f5f5f5" />
                                        <Bar name="Reps / Secs" dataKey="value" fill="black" opacity={opacity.value} />
                                        <Line name="Charge (kg)" type="monotone" dataKey="weightLoad" stroke="#9b0000" strokeOpacity={opacity.weightLoad} />
                                        <Line name="Tension élastique (kg)" type="monotone" dataKey="elastic.tension" stroke="#82ca9d" strokeOpacity={opacity['elastic.tension']} />
                                        <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </section>
                        </div>
                    );
                })
            }

            {/* PR Table */}
            {prTableResults && <PrTableElement PrTableResults={prTableResults} />}
        </div >
    );
}

export default Stats;