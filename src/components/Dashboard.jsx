import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/database';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import './Dashboard.css';

function Dashboard({ onNavigate }) {
    // Get recent workouts
    const recentWorkouts = useLiveQuery(
        () => db.workouts
            .orderBy('date')
            .reverse()
            .limit(5)
            .toArray()
    );

    // Get this week's workout count
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());

    const weeklyWorkouts = useLiveQuery(
        () => db.workouts
            .where('date')
            .between(weekStart, weekEnd, true, true)
            .count()
    );

    // Get total workouts
    const totalWorkouts = useLiveQuery(
        () => db.workouts.count()
    );

    const stats = [
        { label: 'This Week', value: weeklyWorkouts || 0, icon: '🔥' },
        { label: 'Total Workouts', value: totalWorkouts || 0, icon: '💪' },
        { label: 'Streak', value: '0 days', icon: '⚡' }
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Gym Progress Tracker</h1>
                <p className="text-muted">Track your fitness journey</p>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label text-muted">{stat.label}</div>
                    </div>
                ))}
            </div>

            <section className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={() => onNavigate('workout')}
                    >
                        <span style={{ fontSize: '1.5rem' }}>💪</span>
                        Start Workout
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => onNavigate('exercises')}
                    >
                        <span style={{ fontSize: '1.25rem' }}>📋</span>
                        Browse Exercises
                    </button>
                </div>
            </section>

            {recentWorkouts && recentWorkouts.length > 0 && (
                <section className="recent-workouts">
                    <div className="section-header">
                        <h2>Recent Workouts</h2>
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => onNavigate('history')}
                        >
                            View All
                        </button>
                    </div>
                    <div className="workout-list">
                        {recentWorkouts.map((workout) => (
                            <div key={workout.id} className="workout-item card">
                                <div className="workout-date">
                                    {format(new Date(workout.date), 'MMM dd, yyyy')}
                                </div>
                                {workout.duration && (
                                    <div className="workout-duration text-muted">
                                        ⏱️ {workout.duration} min
                                    </div>
                                )}
                                {workout.notes && (
                                    <div className="workout-notes text-sm text-muted">
                                        {workout.notes}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {(!recentWorkouts || recentWorkouts.length === 0) && (
                <div className="empty-state">
                    <div className="empty-icon">🏋️</div>
                    <h3>No workouts yet</h3>
                    <p className="text-muted">Start your first workout to track your progress!</p>
                    <button
                        className="btn btn-primary mt-md"
                        onClick={() => onNavigate('workout')}
                    >
                        Start Now
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
