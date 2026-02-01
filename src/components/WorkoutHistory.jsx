import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { format } from 'date-fns';
import './WorkoutHistory.css';

function WorkoutHistory() {
    const workouts = useLiveQuery(
        () => db.workouts.orderBy('date').reverse().toArray()
    );

    const getWorkoutSets = async (workoutId) => {
        const sets = await db.workoutSets.where('workoutId').equals(workoutId).toArray();
        const exerciseIds = [...new Set(sets.map(s => s.exerciseId))];
        const exercises = await db.exercises.bulkGet(exerciseIds);

        return sets.map(set => ({
            ...set,
            exerciseName: exercises.find(e => e.id === set.exerciseId)?.name || 'Unknown'
        }));
    };

    return (
        <div className="workout-history">
            <header className="page-header">
                <h1>Workout History</h1>
                <p className="text-muted">{workouts?.length || 0} total workouts</p>
            </header>

            {workouts && workouts.length > 0 ? (
                <div className="history-list">
                    {workouts.map((workout) => (
                        <WorkoutCard key={workout.id} workout={workout} getSets={getWorkoutSets} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📊</div>
                    <h3>No workout history yet</h3>
                    <p className="text-muted">Start logging workouts to see your history here</p>
                </div>
            )}
        </div>
    );
}

function WorkoutCard({ workout, getSets }) {
    const [expanded, setExpanded] = useState(false);
    const [sets, setSets] = useState([]);

    const handleExpand = async () => {
        if (!expanded && sets.length === 0) {
            const workoutSets = await getSets(workout.id);
            setSets(workoutSets);
        }
        setExpanded(!expanded);
    };

    const groupedSets = sets.reduce((acc, set) => {
        if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
        acc[set.exerciseName].push(set);
        return acc;
    }, {});

    const totalVolume = sets.reduce((sum, set) => sum + (set.reps * set.weight), 0);

    return (
        <div className="workout-card card">
            <div className="workout-header" onClick={handleExpand}>
                <div className="workout-main-info">
                    <div className="workout-date-large">
                        {format(new Date(workout.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="workout-meta-row">
                        {workout.duration && (
                            <span className="meta-item">⏱️ {workout.duration} min</span>
                        )}
                        {sets.length > 0 && (
                            <>
                                <span className="meta-item">💪 {sets.length} sets</span>
                                <span className="meta-item">📊 {totalVolume.toFixed(0)} kg total</span>
                            </>
                        )}
                    </div>
                </div>
                <button className="expand-btn">
                    {expanded ? '▼' : '▶'}
                </button>
            </div>

            {expanded && sets.length > 0 && (
                <div className="workout-details">
                    {Object.entries(groupedSets).map(([exerciseName, exerciseSets]) => (
                        <div key={exerciseName} className="exercise-detail">
                            <h4>{exerciseName}</h4>
                            <div className="sets-table">
                                {exerciseSets.map((set, index) => (
                                    <div key={index} className="set-row">
                                        <span className="set-col">Set {set.setNumber}</span>
                                        <span className="set-col">{set.reps} reps</span>
                                        <span className="set-col">{set.weight} kg</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {workout.notes && (
                        <div className="workout-notes-display">
                            <strong>Notes:</strong> {workout.notes}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default WorkoutHistory;
