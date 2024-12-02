import { React, useState, useEffect } from "react";
import { XAxis, Tooltip, CartesianGrid, Line, ResponsiveContainer, Bar, ComposedChart, Legend } from 'recharts';
import API from "../utils/API.js";
import Loader from "./Loader.jsx";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;

    return (
        <div style={{ color: "grey" }}>
            {label && <p className="chart-desc">Date: {label}</p>}
            {payload.map((item, index) => (
                <p key={index} className="chart-desc">
                    {item.name === 'value' ? 'Reps / Secs' :
                        item.name === 'weightLoad' ? 'Charge (kg)' :
                            item.name === 'tension' ? 'Tension (kg)' :
                                item.name === 'date' ? 'Date' :
                                    item.name}: {item.value}
                </p>
            ))}
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
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExercise, setSelectedExercise] = useState(0); // Default to first exercise
    const [selectedTimeframe, setSelectedTimeframe] = useState('3m'); // Default to 3 months
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const exerciceData = [];

                // Calculate date range based on selected timeframe
                let dateMin;
                switch (selectedTimeframe) {
                    case '3m':
                        dateMin = new Date(new Date().setMonth(new Date().getMonth() - 3));
                        break;
                    case '1y':
                        dateMin = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
                        break;
                    case 'max':
                        dateMin = new Date(0); // Beginning of time
                        break;
                    default:
                        dateMin = new Date(new Date().setMonth(new Date().getMonth() - 3));
                }

                const topExerciceSets = await API.getSeanceSets({
                    userId: userId,
                    exercice: stats.topExercices[selectedExercise].exercice._id,
                    categories: stats.topExercices[selectedExercise].categories.map(category => { return { category: category.category._id } }),
                    dateMin: dateMin.toISOString()
                });
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
            {/* Exercise and Timeframe Selection */}
            <div className="exercise-selection" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select
                    value={selectedExercise}
                    className="form-control"
                    onChange={(e) => {
                        setSelectedExercise(parseInt(e.target.value));
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
            {workoutDataTopExercices.map((exerciceData, index) => {
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
            })}

            {/* Regularity Score
            {regularityScore && (
                <section className="stats-section">
                    <h2>Workout Regularity</h2>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <h3>Current Streak</h3>
                            <p>{regularityScore.currentStreak} weeks</p>
                        </div>
                        <div className="stat-item">
                            <h3>Best Streak</h3>
                            <p>{regularityScore.bestStreak} weeks</p>
                        </div>
                        <div className="stat-item">
                            <h3>Average</h3>
                            <p>{regularityScore.average.toFixed(1)} sessions/week</p>
                        </div>
                    </div>
                </section>
            )}

            <section className="chart-section">
                <h2>Top Exercises</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={favoriteExercises}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </section> */}
        </div>
    );
}

export default Stats;