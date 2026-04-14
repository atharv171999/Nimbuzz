'use server';

import { auth } from '@/auth';
import { followUser, unfollowUser } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleFollowAction(targetEmail, currentFollowState) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'You must be logged in to follow users.', success: false };
    }

    const myEmail = session.user.email;
    
    if (myEmail === targetEmail) {
        return { error: 'You cannot follow yourself.', success: false };
    }

    try {
        if (currentFollowState) {
            await unfollowUser(myEmail, targetEmail);
        } else {
            await followUser(myEmail, targetEmail);
        }
        
        // Revalidate the dashboard and all generic profiles
        revalidatePath('/dashboard');
        revalidatePath('/dashboard/profile', 'layout');
        
        return { success: true, isFollowing: !currentFollowState };
    } catch (e) {
        return { error: 'Failed to update follow status.', success: false };
    }
}
