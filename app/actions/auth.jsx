'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, getUser, getUserByUsername } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function login(
    prevState,
    formData,
) {
    try {
        const payload = Object.fromEntries(formData);
        await signIn('credentials', { ...payload, redirectTo: '/dashboard' });
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
    prevState,
    formData,
) {
    const name = formData.get('name');
    const email = formData.get('email')?.toString().toLowerCase();
    const password = formData.get('password');
    const username = formData.get('username')?.toString().toLowerCase();
    const dobDay = formData.get('dobDay');
    const dobMonth = formData.get('dobMonth');
    const dobYear = formData.get('dobYear');

    const date_of_birth = (dobYear && dobMonth && dobDay) ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}` : undefined;

    if (!email || !password) return 'Please enter both email and password';
    if (!username) return 'Please enter a username';

    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (name && !nameRegex.test(name)) {
        return 'Name can only contain letters, numbers, and spaces';
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return 'Username can only contain letters, numbers, and underscores (no spaces or special characters)';
    }

    const existingUser = await getUser(email);
    if (existingUser) return 'A user with this email already exists';

    const existingUsername = await getUserByUsername(username);
    if (existingUsername) return 'Username is already taken';

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await createUser({
            id: Date.now().toString(),
            name,
            username,
            email,
            password: hashedPassword,
            date_of_birth,
        });
    } catch (error) {
        console.error('Signup Error:', error);
        if (error.code === '23505') {
            return 'A user with this email or username already exists.';
        }
        return 'An unexpected error occurred during signup.';
    }

    try {
        const payload = Object.fromEntries(formData);
        await signIn('credentials', { ...payload, redirectTo: '/dashboard' });
    } catch (error) {
        if (error instanceof AuthError) {
            return 'Something went wrong logging you in after signup.';
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: '/' });
}
