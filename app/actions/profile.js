'use server';

import { auth } from '@/auth';
import { updateUser, getUserByUsername, getUser } from '@/app/lib/db';
import { supabase } from '@/app/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileAction(prevState, formData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { error: 'You must be logged in to perform this action.' };
        }

        const name = formData.get('name');
        const username = formData.get('username')?.toString().toLowerCase();
        const email = formData.get('email')?.toString().toLowerCase();
        const date_of_birth = formData.get('date_of_birth');
        const bio = formData.get('bio');
        const gender = formData.get('gender');
        const profilePictureFile = formData.get('profile_picture');
        let profilePictureUrl = undefined;

        if (profilePictureFile && profilePictureFile.size > 0) {
            // Keep unique identifier and preserve file extension 
            const fileExt = profilePictureFile.name.split('.').pop();
            const fileName = `${session.user.id || Date.now()}-${Date.now()}.${fileExt}`;

            // Convert File object to ArrayBuffer for Node runtime Supabase compat
            const arrayBuffer = await profilePictureFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, buffer, { 
                    upsert: true,
                    contentType: profilePictureFile.type
                });

            if (uploadError) {
                console.error("Storage upload error:", uploadError);
                throw new Error(`Failed to upload image to Supabase Storage. (Details: ${uploadError.message || JSON.stringify(uploadError)})`);
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
            profilePictureUrl = data.publicUrl;
        }

        const updates = {
            name: name ? name.toString() : '',
            username: username ? username.toString() : '',
            email: email ? email.toString() : session.user.email,
            date_of_birth: date_of_birth ? date_of_birth.toString() : undefined,
            bio: bio ? bio.toString() : '',
            gender: gender ? gender.toString() : '',
        };

        if (profilePictureUrl) {
             updates.profile_picture = profilePictureUrl;
        }

        const nameRegex = /^[a-zA-Z0-9\s]+$/;
        if (updates.name && !nameRegex.test(updates.name)) {
            return { error: 'Name can only contain letters, numbers, and spaces' };
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (updates.username && !usernameRegex.test(updates.username)) {
            return { error: 'Username can only contain letters, numbers, and underscores (no spaces or special characters)' };
        }

        // --- Uniqueness Checks ---
        const currentUser = await getUser(session.user.email);
        
        // Check Username
        if (updates.username && updates.username !== currentUser?.username) {
            const existingWithUsername = await getUserByUsername(updates.username);
            if (existingWithUsername && existingWithUsername.email !== session.user.email) {
                return { error: 'Username is already taken by another user.' };
            }
        }

        // Check Email (if being changed)
        if (updates.email && updates.email !== session.user.email) {
            const existingWithEmail = await getUser(updates.email);
            if (existingWithEmail) {
                return { error: 'Email is already taken by another user.' };
            }
        }
        // -------------------------

        await updateUser(session.user.email, updates);

        revalidatePath('/dashboard/settings/personal-account');
        revalidatePath('/dashboard'); // in case sidebar avatar needs update

        return { success: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Failed to update profile:', error);
        // Extracting Supabase error if available
        const errorMessage = error.message || String(error);
        return { error: `Failed to update profile: ${errorMessage}` };
    }
}
