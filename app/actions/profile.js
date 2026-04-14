'use server';

import { auth } from '@/auth';
import { updateUser } from '@/app/lib/db';
import { supabase } from '@/app/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updateUserProfileAction(prevState, formData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { error: 'You must be logged in to perform this action.' };
        }

        const name = formData.get('name');
        const username = formData.get('username');
        const email = formData.get('email');
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
