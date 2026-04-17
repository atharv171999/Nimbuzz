'use server';

import { searchUsers } from '@/app/lib/db';

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
