import 'server-only';
import { cookies } from 'next/headers';
import type { User, ExerciseLog } from './definitions';

// In-memory store to simulate a database
let users: User[] = [
  { id: '1', fullName: 'Demo User', username: 'demouser', email: 'demo@example.com' },
];
let exerciseLogs: ExerciseLog[] = [
  { id: '1', userId: '1', exerciseName: 'Bench Press', sets: 3, reps: 8, weight: 135, date: new Date('2024-05-01T10:00:00Z').toISOString() },
  { id: '2', userId: '1', exerciseName: 'Squat', sets: 4, reps: 5, weight: 225, date: new Date('2024-05-01T10:00:00Z').toISOString() },
  { id: '3', userId: '1', exerciseName: 'Bench Press', sets: 3, reps: 8, weight: 140, date: new Date('2024-05-08T10:00:00Z').toISOString() },
  { id: '4', userId: '1', exerciseName: 'Deadlift', sets: 1, reps: 5, weight: 315, date: new Date('2024-05-15T10:00:00Z').toISOString() },
  { id: '5', userId: '1', exerciseName: 'Bench Press', sets: 3, reps: 7, weight: 145, date: new Date('2024-05-15T10:00:00Z').toISOString() },
  { id: '6', userId: '1', exerciseName: 'Squat', sets: 4, reps: 5, weight: 235, date: new Date('2024-05-15T10:00:00Z').toISOString() },
  { id: '7', userId: '1', exerciseName: 'Overhead Press', sets: 3, reps: 8, weight: 85, date: new Date('2024-05-22T10:00:00Z').toISOString() },
  { id: '8', userId: '1', exerciseName: 'Bench Press', sets: 3, reps: 8, weight: 150, date: new Date('2024-05-22T10:00:00Z').toISOString() },
];

export async function getSessionUser(): Promise<User | null> {
  const username = cookies().get('session')?.value;
  if (!username) return null;
  return users.find(u => u.username === username) ?? null;
}

export async function findUser(username: string, email: string): Promise<User | undefined> {
  return users.find(u => u.username === username && u.email === email);
}

export async function userExists(username: string, email: string): Promise<boolean> {
  return users.some(u => u.username === username || u.email === email);
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  const newUser = { ...user, id: String(users.length + 1) };
  users.push(newUser);
  return newUser;
}

export async function getExerciseLogsForUser(userId: string): Promise<ExerciseLog[]> {
  return exerciseLogs.filter(log => log.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function addExerciseLog(log: Omit<ExerciseLog, 'id'>): Promise<ExerciseLog> {
  const newLog = { ...log, id: String(exerciseLogs.length + 1) };
  exerciseLogs.push(newLog);
  return newLog;
}

export async function getUniqueExercisesForUser(userId: string): Promise<string[]> {
    const logs = await getExerciseLogsForUser(userId);
    const exerciseNames = logs.map(log => log.exerciseName);
    return [...new Set(exerciseNames)];
}
