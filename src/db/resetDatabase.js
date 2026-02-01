// Database Reset Utility
// Open browser console and run: resetDatabase()

import { db } from './database.js';

export async function resetDatabase() {
    try {
        // Clear all tables
        await db.exercises.clear();
        await db.workouts.clear();
        await db.workoutSets.clear();
        await db.routines.clear();
        await db.routineExercises.clear();

        console.log('✅ Database cleared successfully!');
        console.log('🔄 Please refresh the page to reinitialize with fresh data.');

        return true;
    } catch (error) {
        console.error('❌ Failed to reset database:', error);
        return false;
    }
}

// Make it available globally in development
if (typeof window !== 'undefined') {
    window.resetDatabase = resetDatabase;
}
