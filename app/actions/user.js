'use server';

import { searchUsers, getUserByUsername, getUser } from '@/app/lib/db';

/**
 * Server action to search for users by username.
 * Primarily used for the Live Search feature in the Mobile Header.
 */
export async function searchUsersAction(query) {
    if (!query || query.trim().length === 0) {
        return [];
    }
    
    try {
        const users = await searchUsers(query.trim());
        // Return only the necessary public data
        return users.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            profile_picture: user.profile_picture
        }));
    } catch (error) {
        console.error('Error in searchUsersAction:', error);
        return [];
    }
}

/**
 * Server action to get a list of users for suggestions.
 */
export async function getAllUsersAction() {
    try {
        const { getUsers } = await import('@/app/lib/db');
        const users = await getUsers();
        return users.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            profile_picture: user.profile_picture
        }));
    } catch (error) {
        console.error('Error in getAllUsersAction:', error);
        return [];
    }
}

/**
 * Checks if a username is available.
 * If currentEmail is provided, it ignores that specific user (useful for profile updates).
 */
export async function checkUsernameAvailability(username, currentEmail = null) {
    if (!username || username.trim().length === 0) return { available: true };
    
    try {
        const normalizedUsername = username.trim().toLowerCase();
        const user = await getUserByUsername(normalizedUsername);
        
        if (!user) return { available: true };
        
        // If the user found is the current user themselves, it's "available"
        if (currentEmail && user.email === currentEmail.toLowerCase()) {
            return { available: true };
        }
        
        return { available: false };
    } catch (error) {
        console.error('Error checking username availability:', error);
        return { available: false, error: 'Failed to verify availability' };
    }
}

/**
 * Checks if an email is available.
 */
export async function checkEmailAvailability(email, currentEmail = null) {
    if (!email || email.trim().length === 0) return { available: true };

    try {
        const normalizedEmail = email.trim().toLowerCase();
        
        // If it's the same as their current email, it's available
        if (currentEmail && normalizedEmail === currentEmail.toLowerCase()) {
            return { available: true };
        }

        const user = await getUser(normalizedEmail);
        return { available: !user };
    } catch (error) {
        console.error('Error checking email availability:', error);
        return { available: false, error: 'Failed to verify availability' };
    }
}
