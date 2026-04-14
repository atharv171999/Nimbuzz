'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, getUser } from '@/app/lib/db';
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
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    const dobDay = formData.get('dobDay');
    const dobMonth = formData.get('dobMonth');
    const dobYear = formData.get('dobYear');

    const date_of_birth = (dobYear && dobMonth && dobDay) ? `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}` : undefined;

    if (!email || !password) return 'Please enter both email and password';
    if (!username) return 'Please enter a username';

    const existingUser = await getUser(email);
    if (existingUser) return 'A user with this email already exists';

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser({
        id: Date.now().toString(),
        name,
        username,
        email,
        password: hashedPassword,
        date_of_birth,
    });

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
