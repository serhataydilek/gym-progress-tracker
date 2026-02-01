import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, MUSCLE_GROUPS } from '../db/database';
import './ExerciseList.css';

function ExerciseList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
    const [showAddForm, setShowAddForm] = useState(false);

    const exercises = useLiveQuery(() => {
        let query = db.exercises.toArray();
        return query;
    });

    const filteredExercises = exercises?.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMuscleGroup = selectedMuscleGroup === 'All' || exercise.muscleGroup === selectedMuscleGroup;
        return matchesSearch && matchesMuscleGroup;
    });

    const groupedExercises = filteredExercises?.reduce((acc, exercise) => {
        const group = exercise.muscleGroup;
        if (!acc[group]) acc[group] = [];
        acc[group].push(exercise);
        return acc;
    }, {});

    return (
        <div className="exercise-list">
            <header className="page-header">
                <h1>Exercise Database</h1>
                <p className="text-muted">Browse {exercises?.length || 0} exercises</p>
            </header>

            <div className="search-section">
                <input
                    type="text"
                    className="input"
                    placeholder="🔍 Search exercises..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="filter-section">
                <div className="filter-chips">
                    <button
                        className={`filter-chip ${selectedMuscleGroup === 'All' ? 'active' : ''}`}
                        onClick={() => setSelectedMuscleGroup('All')}
                    >
                        All
                    </button>
                    {MUSCLE_GROUPS.map(group => (
                        <button
                            key={group}
                            className={`filter-chip ${selectedMuscleGroup === group ? 'active' : ''}`}
                            onClick={() => setSelectedMuscleGroup(group)}
                        >
                            {group}
                        </button>
                    ))}
                </div>
            </div>

            <div className="exercises-content">
                {groupedExercises && Object.keys(groupedExercises).length > 0 ? (
                    Object.entries(groupedExercises).map(([muscleGroup, exercises]) => (
                        <div key={muscleGroup} className="exercise-group">
                            <h3 className="group-title">{muscleGroup}</h3>
                            <div className="exercise-grid">
                                {exercises.map(exercise => (
                                    <div key={exercise.id} className="exercise-card card">
                                        <div className="exercise-name">{exercise.name}</div>
                                        <div className="exercise-meta">
                                            <span className="badge badge-primary">{exercise.category}</span>
                                            <span className="text-muted text-sm">{exercise.equipment}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🔍</div>
                        <h3>No exercises found</h3>
                        <p className="text-muted">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExerciseList;
