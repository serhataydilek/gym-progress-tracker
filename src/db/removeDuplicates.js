import { db } from './database.js';

// Remove duplicate exercises based on name
export async function removeDuplicateExercises() {
    try {
        const allExercises = await db.exercises.toArray();
        const seen = new Set();
        const duplicateIds = [];

        // Find duplicates
        allExercises.forEach(exercise => {
            if (seen.has(exercise.name)) {
                duplicateIds.push(exercise.id);
            } else {
                seen.add(exercise.name);
            }
        });

        // Delete duplicates
        if (duplicateIds.length > 0) {
            await db.exercises.bulkDelete(duplicateIds);
            console.log(`🧹 Removed ${duplicateIds.length} duplicate exercises`);
            return duplicateIds.length;
        }

        return 0;
    } catch (error) {
        console.error('Failed to remove duplicates:', error);
        return 0;
    }
}
