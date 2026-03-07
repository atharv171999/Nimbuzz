'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, getUser } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function login(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', Object.fromEntries(formData));
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function signup(
    prevState: string | undefined,
    formData: FormData,
) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) return 'Please enter both email and password';

    const existingUser = await getUser(email);
    if (existingUser) return 'A user with this email already exists';

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
        id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
    });

    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            return 'Something went wrong logging you in after signup.';
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: '/login' });
}
