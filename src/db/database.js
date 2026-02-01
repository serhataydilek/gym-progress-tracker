import Dexie from 'dexie';

export const db = new Dexie('GymProgressTracker');

// Define database schema
db.version(1).stores({
    exercises: '++id, name, category, muscleGroup, equipment',
    workouts: '++id, date, duration, notes',
    workoutSets: '++id, workoutId, exerciseId, setNumber, reps, weight, restTime, notes',
    routines: '++id, name, description, createdAt',
    routineExercises: '++id, routineId, exerciseId, order, sets, reps, restTime'
});

// Exercise categories
export const MUSCLE_GROUPS = [
    'Chest',
    'Back',
    'Shoulders',
    'Arms',
    'Legs',
    'Core',
    'Cardio',
    'Full Body'
];

export const EQUIPMENT_TYPES = [
    'Barbell',
    'Dumbbell',
    'Machine',
    'Cable',
    'Bodyweight',
    'Resistance Band',
    'Kettlebell',
    'Other'
];

// Track if database has been initialized
let isInitialized = false;

// Initialize database with seed data
export async function initializeDatabase() {
    // Prevent multiple initializations
    if (isInitialized) {
        return;
    }

    const exerciseCount = await db.exercises.count();

    if (exerciseCount === 0) {
        // Seed with common exercises
        await db.exercises.bulkAdd([
            // Chest
            { name: 'Bench Press', category: 'Compound', muscleGroup: 'Chest', equipment: 'Barbell' },
            { name: 'Incline Bench Press', category: 'Compound', muscleGroup: 'Chest', equipment: 'Barbell' },
            { name: 'Dumbbell Chest Press', category: 'Compound', muscleGroup: 'Chest', equipment: 'Dumbbell' },
            { name: 'Chest Fly', category: 'Isolation', muscleGroup: 'Chest', equipment: 'Dumbbell' },
            { name: 'Push-ups', category: 'Compound', muscleGroup: 'Chest', equipment: 'Bodyweight' },
            { name: 'Cable Crossover', category: 'Isolation', muscleGroup: 'Chest', equipment: 'Cable' },

            // Back
            { name: 'Deadlift', category: 'Compound', muscleGroup: 'Back', equipment: 'Barbell' },
            { name: 'Barbell Row', category: 'Compound', muscleGroup: 'Back', equipment: 'Barbell' },
            { name: 'Pull-ups', category: 'Compound', muscleGroup: 'Back', equipment: 'Bodyweight' },
            { name: 'Lat Pulldown', category: 'Compound', muscleGroup: 'Back', equipment: 'Cable' },
            { name: 'Seated Cable Row', category: 'Compound', muscleGroup: 'Back', equipment: 'Cable' },
            { name: 'Dumbbell Row', category: 'Compound', muscleGroup: 'Back', equipment: 'Dumbbell' },

            // Shoulders
            { name: 'Overhead Press', category: 'Compound', muscleGroup: 'Shoulders', equipment: 'Barbell' },
            { name: 'Dumbbell Shoulder Press', category: 'Compound', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
            { name: 'Lateral Raise', category: 'Isolation', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
            { name: 'Front Raise', category: 'Isolation', muscleGroup: 'Shoulders', equipment: 'Dumbbell' },
            { name: 'Face Pull', category: 'Isolation', muscleGroup: 'Shoulders', equipment: 'Cable' },

            // Arms
            { name: 'Barbell Curl', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Barbell' },
            { name: 'Dumbbell Curl', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Dumbbell' },
            { name: 'Hammer Curl', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Dumbbell' },
            { name: 'Tricep Dips', category: 'Compound', muscleGroup: 'Arms', equipment: 'Bodyweight' },
            { name: 'Tricep Pushdown', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Cable' },
            { name: 'Skull Crushers', category: 'Isolation', muscleGroup: 'Arms', equipment: 'Barbell' },

            // Legs
            { name: 'Squat', category: 'Compound', muscleGroup: 'Legs', equipment: 'Barbell' },
            { name: 'Front Squat', category: 'Compound', muscleGroup: 'Legs', equipment: 'Barbell' },
            { name: 'Leg Press', category: 'Compound', muscleGroup: 'Legs', equipment: 'Machine' },
            { name: 'Romanian Deadlift', category: 'Compound', muscleGroup: 'Legs', equipment: 'Barbell' },
            { name: 'Leg Curl', category: 'Isolation', muscleGroup: 'Legs', equipment: 'Machine' },
            { name: 'Leg Extension', category: 'Isolation', muscleGroup: 'Legs', equipment: 'Machine' },
            { name: 'Calf Raise', category: 'Isolation', muscleGroup: 'Legs', equipment: 'Machine' },
            { name: 'Lunges', category: 'Compound', muscleGroup: 'Legs', equipment: 'Bodyweight' },

            // Core
            { name: 'Plank', category: 'Isometric', muscleGroup: 'Core', equipment: 'Bodyweight' },
            { name: 'Crunches', category: 'Isolation', muscleGroup: 'Core', equipment: 'Bodyweight' },
            { name: 'Russian Twist', category: 'Isolation', muscleGroup: 'Core', equipment: 'Bodyweight' },
            { name: 'Hanging Leg Raise', category: 'Isolation', muscleGroup: 'Core', equipment: 'Bodyweight' },
            { name: 'Cable Crunch', category: 'Isolation', muscleGroup: 'Core', equipment: 'Cable' },

            // Cardio
            { name: 'Running', category: 'Cardio', muscleGroup: 'Cardio', equipment: 'Other' },
            { name: 'Cycling', category: 'Cardio', muscleGroup: 'Cardio', equipment: 'Machine' },
            { name: 'Rowing', category: 'Cardio', muscleGroup: 'Cardio', equipment: 'Machine' },
            { name: 'Jump Rope', category: 'Cardio', muscleGroup: 'Cardio', equipment: 'Other' },
        ]);

        console.log('Database initialized with seed data');
    }

    isInitialized = true;
}

export default db;
