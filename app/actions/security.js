'use server';

import { auth } from '@/auth';
import { getUser, updateUser } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Changes the user's password after verifying the old one.
 */
export async function changePasswordAction(prevState, formData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { error: 'You must be logged in to perform this action.' };
        }

        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');

        if (!currentPassword || !newPassword || !confirmPassword) {
            return { error: 'All fields are required.' };
        }

        if (newPassword !== confirmPassword) {
            return { error: 'New passwords do not match.' };
        }

        if (newPassword.length < 6) {
            return { error: 'New password must be at least 6 characters long.' };
        }

        // 1. Fetch user from DB to get the current hashed password
        const user = await getUser(session.user.email);
        if (!user || !user.password) {
            return { error: 'User account not found or password not set.' };
        }

        // 2. Verify current password
        const isCorrect = await bcrypt.compare(currentPassword, user.password);
        if (!isCorrect) {
            return { error: 'Current password is incorrect.' };
        }

        // 3. Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 4. Update the user in the database
        await updateUser(session.user.email, {
            password: hashedPassword
        });

        revalidatePath('/dashboard/settings/security');
        
        return { success: 'Password changed successfully!' };

    } catch (error) {
        console.error('Change Password Error:', error);
        return { error: 'An unexpected error occurred. Please try again.' };
    }
}
