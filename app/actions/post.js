'use server';

import { auth } from '@/auth';
import { supabase } from '@/app/lib/supabase';
import { createPost } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPostAction(prevState, formData) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            throw new Error('Not authenticated');
        }

        const imageFile = formData.get('image');
        const caption = formData.get('caption') || '';

        if ((!imageFile || imageFile.size === 0) && !caption.trim()) {
            throw new Error("Please provide either a photo or write a caption.");
        }

        let publicUrl = '';

        if (imageFile && imageFile.size > 0) {
            // Upload image to Supabase 'posts' bucket
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${session.user.id || Date.now()}-${Date.now()}.${fileExt}`;

            // Convert File to ArrayBuffer for Node compat
            const arrayBuffer = await imageFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const { error: uploadError } = await supabase.storage
                .from('posts')
                .upload(fileName, buffer, {
                    contentType: imageFile.type,
                });

            if (uploadError) {
                console.error("Storage upload error:", uploadError);
                throw new Error(`Failed to upload post image. (Details: ${uploadError.message})`);
            }

            // Grab public URL
            const { data } = supabase.storage.from('posts').getPublicUrl(fileName);
            publicUrl = data.publicUrl;
        }

        // Save entry internally to posts table
        await createPost({
            user_email: session.user.email,
            image_url: publicUrl,
            caption: caption
        });

        // Revalidate the dashboard feed
        revalidatePath('/dashboard');
        
        return { success: 'Post created successfully!' };
    } catch (error) {
        console.error("Create Post Error:", error);
        return { error: error.message || 'An error occurred while creating the post.' };
    }
}
