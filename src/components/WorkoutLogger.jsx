import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import './WorkoutLogger.css';

function WorkoutLogger() {
    const [currentWorkout, setCurrentWorkout] = useState({
        date: new Date(),
        sets: [],
        notes: ''
    });
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [setData, setSetData] = useState({ reps: '', weight: '', restTime: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const exercises = useLiveQuery(() => db.exercises.toArray());

    const filteredExercises = exercises?.filter(ex =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    const addSet = async () => {
        if (!selectedExercise || !setData.reps || !setData.weight) {
            alert('Please select an exercise and fill in reps and weight');
            return;
        }

        const newSet = {
            exerciseId: selectedExercise.id,
            exerciseName: selectedExercise.name,
            setNumber: currentWorkout.sets.filter(s => s.exerciseId === selectedExercise.id).length + 1,
            reps: parseInt(setData.reps),
            weight: parseFloat(setData.weight),
            restTime: setData.restTime ? parseInt(setData.restTime) : null,
            timestamp: new Date()
        };

        setCurrentWorkout({
            ...currentWorkout,
            sets: [...currentWorkout.sets, newSet]
        });

        // Reset set data but keep exercise selected
        setSetData({ reps: '', weight: '', restTime: '' });
    };

    const removeSet = (index) => {
        setCurrentWorkout({
            ...currentWorkout,
            sets: currentWorkout.sets.filter((_, i) => i !== index)
        });
    };

    const saveWorkout = async () => {
        if (currentWorkout.sets.length === 0) {
            alert('Add at least one set before saving');
            return;
        }

        try {
            // Calculate duration (in minutes)
            const duration = currentWorkout.sets.length > 0
                ? Math.round((new Date() - currentWorkout.date) / 60000)
                : 0;

            // Save workout
            const workoutId = await db.workouts.add({
                date: currentWorkout.date,
                duration,
                notes: currentWorkout.notes
            });

            // Save all sets
            await Promise.all(
                currentWorkout.sets.map(set =>
                    db.workoutSets.add({
                        workoutId,
                        exerciseId: set.exerciseId,
                        setNumber: set.setNumber,
                        reps: set.reps,
                        weight: set.weight,
                        restTime: set.restTime
                    })
                )
            );

            alert('Workout saved successfully! 💪');

            // Reset workout
            setCurrentWorkout({
                date: new Date(),
                sets: [],
                notes: ''
            });
            setSelectedExercise(null);
            setSearchTerm('');
        } catch (error) {
            console.error('Failed to save workout:', error);
            alert('Failed to save workout. Please try again.');
        }
    };

    const groupedSets = currentWorkout.sets.reduce((acc, set) => {
        if (!acc[set.exerciseName]) acc[set.exerciseName] = [];
        acc[set.exerciseName].push(set);
        return acc;
    }, {});

    return (
        <div className="workout-logger">
            <header className="page-header">
                <h1>Log Workout</h1>
                <p className="text-muted">Track your sets and reps</p>
            </header>

            <div className="logger-container">
                <section className="exercise-selector card">
                    <h3>Select Exercise</h3>
                    <input
                        type="text"
                        className="input"
                        placeholder="🔍 Search exercises..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {searchTerm && filteredExercises && filteredExercises.length > 0 && (
                        <div className="exercise-dropdown">
                            {filteredExercises.map(exercise => (
                                <button
                                    key={exercise.id}
                                    className={`exercise-option ${selectedExercise?.id === exercise.id ? 'selected' : ''}`}
                                    onClick={() => {
                                        setSelectedExercise(exercise);
                                        setSearchTerm(exercise.name);
                                    }}
                                >
                                    <div className="exercise-option-name">{exercise.name}</div>
                                    <div className="exercise-option-meta text-sm text-muted">
                                        {exercise.muscleGroup} • {exercise.equipment}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {selectedExercise && (
                    <section className="set-input card">
                        <h3>Add Set - {selectedExercise.name}</h3>
                        <div className="input-grid">
                            <div className="input-group">
                                <label>Reps</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="12"
                                    value={setData.reps}
                                    onChange={(e) => setSetData({ ...setData, reps: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.5"
                                    className="input"
                                    placeholder="50"
                                    value={setData.weight}
                                    onChange={(e) => setSetData({ ...setData, weight: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Rest (sec)</label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="60"
                                    value={setData.restTime}
                                    onChange={(e) => setSetData({ ...setData, restTime: e.target.value })}
                                />
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={addSet}>
                            Add Set
                        </button>
                    </section>
                )}

                {currentWorkout.sets.length > 0 && (
                    <section className="current-sets card">
                        <h3>Current Workout ({currentWorkout.sets.length} sets)</h3>
                        <div className="sets-list">
                            {Object.entries(groupedSets).map(([exerciseName, sets]) => (
                                <div key={exerciseName} className="exercise-sets-group">
                                    <h4>{exerciseName}</h4>
                                    {sets.map((set, index) => (
                                        <div key={index} className="set-item">
                                            <div className="set-info">
                                                <span className="set-number">Set {set.setNumber}</span>
                                                <span className="set-details">
                                                    {set.reps} reps × {set.weight} kg
                                                </span>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeSet(currentWorkout.sets.indexOf(set))}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="workout-notes">
                            <label>Workout Notes</label>
                            <textarea
                                className="input"
                                rows="3"
                                placeholder="How did it feel? Any observations?"
                                value={currentWorkout.notes}
                                onChange={(e) => setCurrentWorkout({ ...currentWorkout, notes: e.target.value })}
                            />
                        </div>

                        <button className="btn btn-success btn-lg" onClick={saveWorkout}>
                            💾 Save Workout
                        </button>
                    </section>
                )}

                {currentWorkout.sets.length === 0 && !selectedExercise && (
                    <div className="empty-state">
                        <div className="empty-icon">💪</div>
                        <h3>Ready to start?</h3>
                        <p className="text-muted">Search for an exercise above to begin logging your workout</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WorkoutLogger;
