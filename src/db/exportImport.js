import { db } from './database';

// Export all data to JSON file
export async function exportData() {
    try {
        const data = {
            exercises: await db.exercises.toArray(),
            workouts: await db.workouts.toArray(),
            workoutSets: await db.workoutSets.toArray(),
            routines: await db.routines.toArray(),
            routineExercises: await db.routineExercises.toArray(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Data exported successfully!');
        return true;
    } catch (error) {
        console.error('❌ Failed to export data:', error);
        return false;
    }
}

// Import data from JSON file
export async function importData(file) {
    try {
        const text = await file.text();
        const data = JSON.parse(text);

        // Validate data structure
        if (!data.exercises || !data.workouts || !data.workoutSets) {
            throw new Error('Invalid backup file format');
        }

        // Clear existing data
        await db.exercises.clear();
        await db.workouts.clear();
        await db.workoutSets.clear();
        await db.routines.clear();
        await db.routineExercises.clear();

        // Import data
        if (data.exercises.length > 0) await db.exercises.bulkAdd(data.exercises);
        if (data.workouts.length > 0) await db.workouts.bulkAdd(data.workouts);
        if (data.workoutSets.length > 0) await db.workoutSets.bulkAdd(data.workoutSets);
        if (data.routines && data.routines.length > 0) await db.routines.bulkAdd(data.routines);
        if (data.routineExercises && data.routineExercises.length > 0) {
            await db.routineExercises.bulkAdd(data.routineExercises);
        }

        console.log('✅ Data imported successfully!');
        return true;
    } catch (error) {
        console.error('❌ Failed to import data:', error);
        throw error;
    }
}

// Make functions available globally in development
if (typeof window !== 'undefined') {
    window.exportGymData = exportData;
    window.importGymData = importData;
}
