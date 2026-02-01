import { useState, useEffect } from 'react';
import { initializeDatabase } from './db/database';
import { resetDatabase } from './db/resetDatabase';
import { removeDuplicateExercises } from './db/removeDuplicates';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import WorkoutHistory from './components/WorkoutHistory';
import ExerciseList from './components/ExerciseList';
import ProgressCharts from './components/ProgressCharts';
import Settings from './components/Settings';

function App() {
    const [currentView, setCurrentView] = useState('dashboard');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initialize database on app load
        initializeDatabase()
            .then(async () => {
                // Remove any duplicate exercises
                await removeDuplicateExercises();
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Failed to initialize database:', error);
                setIsLoading(false);
            });

        // Make reset function available in console for development
        if (import.meta.env.DEV) {
            window.resetDatabase = resetDatabase;
            console.log('💡 Tip: Run resetDatabase() in console to clear all data');
        }
    }, []);

    if (isLoading) {
        return (
            <div className="app-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="animate-pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                        💪
                    </div>
                    <h2>Loading Gym Tracker...</h2>
                </div>
            </div>
        );
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard onNavigate={setCurrentView} />;
            case 'workout':
                return <WorkoutLogger />;
            case 'history':
                return <WorkoutHistory />;
            case 'exercises':
                return <ExerciseList />;
            case 'progress':
                return <ProgressCharts />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard onNavigate={setCurrentView} />;
        }
    };

    return (
        <div className="app-container">
            <main className="main-content animate-fade-in">
                {renderView()}
            </main>
            <Navigation currentView={currentView} onNavigate={setCurrentView} />
        </div>
    );
}

export default App;
