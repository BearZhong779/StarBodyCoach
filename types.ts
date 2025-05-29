export interface WorkoutTemplate {
  id: string;
  name: string;
  duration: number;
  difficulty: string;
  type: string;
  schedule: string;
  icon: string;
  color: string;
}

export interface WeeklyWorkout {
  week: number;
  title: string;
  workouts: WorkoutTemplate[];
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  color: string;
}

export interface ProgressData {
  weeklyWorkouts: number;
  weeklyCalories: number;
  sessions: Array<{
    day: string;
    duration: number;
    calories: number;
  }>;
}
