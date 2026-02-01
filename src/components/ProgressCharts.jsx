import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import './ProgressCharts.css';

function ProgressCharts() {
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [timeRange, setTimeRange] = useState(30); // days

    const exercises = useLiveQuery(() => db.exercises.toArray());

    const workoutSets = useLiveQuery(
        async () => {
            if (!selectedExercise) return [];

            const cutoffDate = subDays(new Date(), timeRange);
            const sets = await db.workoutSets
                .where('exerciseId')
                .equals(selectedExercise.id)
                .toArray();

            // Get workout dates for each set
            const workoutIds = [...new Set(sets.map(s => s.workoutId))];
            const workouts = await db.workouts.bulkGet(workoutIds);

            const setsWithDates = sets.map(set => ({
                ...set,
                date: workouts.find(w => w.id === set.workoutId)?.date
            })).filter(set => set.date && new Date(set.date) >= cutoffDate);

            return setsWithDates;
        },
        [selectedExercise, timeRange]
    );

    // Calculate max weight per workout
    const chartData = React.useMemo(() => {
        if (!workoutSets || workoutSets.length === 0) return [];

        const groupedByWorkout = workoutSets.reduce((acc, set) => {
            const dateKey = format(new Date(set.date), 'MMM dd');
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, maxWeight: 0, totalVolume: 0, sets: 0 };
            }
            acc[dateKey].maxWeight = Math.max(acc[dateKey].maxWeight, set.weight);
            acc[dateKey].totalVolume += set.weight * set.reps;
            acc[dateKey].sets += 1;
            return acc;
        }, {});

        return Object.values(groupedByWorkout).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    }, [workoutSets]);

    // Calculate personal records
    const personalRecords = React.useMemo(() => {
        if (!workoutSets || workoutSets.length === 0) return null;

        const maxWeight = Math.max(...workoutSets.map(s => s.weight));
        const maxReps = Math.max(...workoutSets.map(s => s.reps));
        const maxVolume = Math.max(...workoutSets.map(s => s.weight * s.reps));

        return { maxWeight, maxReps, maxVolume };
    }, [workoutSets]);

    return (
        <div className="progress-charts">
            <header className="page-header">
                <h1>Progress Tracking</h1>
                <p className="text-muted">Visualize your strength gains</p>
            </header>

            <section className="exercise-selector-section card">
                <h3>Select Exercise</h3>
                <select
                    className="select"
                    value={selectedExercise?.id || ''}
                    onChange={(e) => {
                        const exercise = exercises?.find(ex => ex.id === parseInt(e.target.value));
                        setSelectedExercise(exercise);
                    }}
                >
                    <option value="">Choose an exercise...</option>
                    {exercises?.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name} ({exercise.muscleGroup})
                        </option>
                    ))}
                </select>

                <div className="time-range-selector">
                    <button
                        className={`btn btn-sm ${timeRange === 7 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeRange(7)}
                    >
                        7 Days
                    </button>
                    <button
                        className={`btn btn-sm ${timeRange === 30 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeRange(30)}
                    >
                        30 Days
                    </button>
                    <button
                        className={`btn btn-sm ${timeRange === 90 ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setTimeRange(90)}
                    >
                        90 Days
                    </button>
                </div>
            </section>

            {selectedExercise && personalRecords && (
                <section className="personal-records">
                    <h3>Personal Records - {selectedExercise.name}</h3>
                    <div className="pr-grid">
                        <div className="pr-card card">
                            <div className="pr-icon">🏋️</div>
                            <div className="pr-value">{personalRecords.maxWeight} kg</div>
                            <div className="pr-label text-muted">Max Weight</div>
                        </div>
                        <div className="pr-card card">
                            <div className="pr-icon">🔢</div>
                            <div className="pr-value">{personalRecords.maxReps}</div>
                            <div className="pr-label text-muted">Max Reps</div>
                        </div>
                        <div className="pr-card card">
                            <div className="pr-icon">📊</div>
                            <div className="pr-value">{personalRecords.maxVolume.toFixed(0)}</div>
                            <div className="pr-label text-muted">Max Volume (kg)</div>
                        </div>
                    </div>
                </section>
            )}

            {selectedExercise && chartData.length > 0 && (
                <section className="charts-section card">
                    <h3>Weight Progression</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="maxWeight"
                                stroke="#6366f1"
                                strokeWidth={3}
                                name="Max Weight (kg)"
                                dot={{ fill: '#6366f1', r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>

                    <h3 className="mt-lg">Total Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="date"
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '0.5rem'
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="totalVolume"
                                stroke="#10b981"
                                strokeWidth={3}
                                name="Total Volume (kg)"
                                dot={{ fill: '#10b981', r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </section>
            )}

            {selectedExercise && chartData.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">📈</div>
                    <h3>No data yet</h3>
                    <p className="text-muted">
                        Start logging workouts for {selectedExercise.name} to see your progress
                    </p>
                </div>
            )}

            {!selectedExercise && (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>Select an exercise</h3>
                    <p className="text-muted">Choose an exercise above to view your progress charts</p>
                </div>
            )}
        </div>
    );
}

export default ProgressCharts;
