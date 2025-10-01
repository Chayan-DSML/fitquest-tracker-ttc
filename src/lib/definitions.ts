export type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
};

export type ExerciseLog = {
  id: string;
  userId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string; // ISO string
};
