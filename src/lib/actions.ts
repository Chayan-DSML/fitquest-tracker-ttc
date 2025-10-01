'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  findUser,
  userExists,
  addUser,
  getSessionUser,
  addExerciseLog,
} from './data';

const SignInSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
});

const SignUpSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required.' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
});

const LogExerciseSchema = z.object({
    exerciseName: z.string().min(1, "Exercise name is required."),
    sets: z.coerce.number().min(1, "Sets must be at least 1."),
    reps: z.coerce.number().min(1, "Reps must be at least 1."),
    weight: z.coerce.number().min(0, "Weight cannot be negative."),
});


export type AuthState = {
  message?: string;
};

export async function signIn(prevState: AuthState | undefined, formData: FormData) {
  const validatedFields = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Invalid fields.',
    };
  }

  const { username, email } = validatedFields.data;
  const user = await findUser(username, email);

  if (!user) {
    return { message: 'Invalid username or email.' };
  }

  cookies().set('session', user.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });

  redirect('/dashboard');
}

export async function signUp(prevState: AuthState | undefined, formData: FormData) {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      message: 'Invalid fields.',
    };
  }

  const { fullName, username, email } = validatedFields.data;

  if (await userExists(username, email)) {
    return { message: 'Username or email already exists.' };
  }

  const newUser = await addUser({ fullName, username, email });

  cookies().set('session', newUser.username, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  });

  redirect('/dashboard');
}

export async function signOut() {
  cookies().delete('session');
  redirect('/signin');
}


export type LogExerciseState = {
    message?: string;
    success?: boolean;
};

export async function logExercise(prevState: LogExerciseState | undefined, formData: FormData): Promise<LogExerciseState> {
    const user = await getSessionUser();
    if (!user) {
        return { message: 'Authentication required.' };
    }

    const validatedFields = LogExerciseSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { message: "Invalid data provided." };
    }
    
    const { exerciseName, sets, reps, weight } = validatedFields.data;

    await addExerciseLog({
        userId: user.id,
        exerciseName,
        sets,
        reps,
        weight,
        date: new Date().toISOString(),
    });

    revalidatePath('/dashboard');
    return { message: `Successfully logged ${exerciseName}!`, success: true };
}
