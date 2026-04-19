'use server';

import { supabase } from '@/app/lib/supabase';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

/**
 * Creates a new community activity ping.
 */
export async function createActivity(formData) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    // Get current user UUID
    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
    
    if (!userData) return { error: 'User mapping failed' };

    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    const locationName = formData.get('location_name');
    const cityOrArea = formData.get('city_or_area');
    const eventTime = formData.get('event_time');
    const maxParticipants = parseInt(formData.get('max_participants') || '10');

    try {
        const { error } = await supabase
            .from('activities')
            .insert([{
                creator_id: userData.id,
                title,
                description,
                category,
                location_name: locationName,
                city_or_area: cityOrArea,
                event_time: eventTime,
                max_participants: maxParticipants
            }]);

        if (error) {
            console.error('Error creating activity:', error.message, error.details);
            return { error: `Failed to create activity: ${error.message}` };
        }

        revalidatePath('/dashboard/society');
        return { success: true };
    } catch (e) {
        console.error('Unexpected error creating activity:', e);
        return { error: 'An unexpected error occurred while creating the activity.' };
    }
}

/**
 * Fetches activities with optional filters and participant counts.
 */
export async function fetchLocalActivities(filters = {}) {
    let query = supabase
        .from('activities')
        .select(`
            *,
            creator:users!creator_id (username, name, profile_picture),
            activity_participants!activity_id (
                user_id,
                users (name, username, profile_picture)
            )
        `)
        .order('event_time', { ascending: true });

    if (filters.category && filters.category !== 'All') {
        query = query.eq('category', filters.category);
    }

    if (filters.area) {
        query = query.ilike('city_or_area', `%${filters.area}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching activities:', error.message, error.details, error.hint);
        return [];
    }

    return data || [];
}

/**
 * Deletes an activity.
 */
export async function deleteActivity(activityId) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    // Get current user UUID
    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();
    
    if (!userData) return { error: 'User mapping failed' };

    try {
        // Delete ONLY if the user is the creator
        const { error } = await supabase
            .from('activities')
            .delete()
            .eq('id', activityId)
            .eq('creator_id', userData.id);

        if (error) {
            console.error('Error deleting activity:', error.message);
            return { error: `Failed to delete ping: ${error.message}` };
        }

        revalidatePath('/dashboard/society');
        return { success: true };
    } catch (e) {
        console.error('Unexpected error deleting activity:', e);
        return { error: 'An unexpected error occurred while deleting the activity.' };
    }
}


/**
 * Join an activity as a participant.
 */
export async function joinActivity(activityId) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

    if (!userData) return { error: 'User mapping failed' };

    try {
        // Check if already joined
        const { data: existing } = await supabase
            .from('activity_participants')
            .select('id')
            .eq('activity_id', activityId)
            .eq('user_id', userData.id)
            .maybeSingle();

        if (existing) return { error: 'Already joined' };

        const { error } = await supabase
            .from('activity_participants')
            .insert([{
                activity_id: activityId,
                user_id: userData.id,
                status: 'going'
            }]);

        if (error) {
            console.error('Error joining activity:', error.message, error.details);
            if (error.code === '23505') return { error: 'You are already a participant.' };
            return { error: `Failed to join: ${error.message}` };
        }

        revalidatePath('/dashboard/society');
        return { success: true };
    } catch (e) {
        console.error('Unexpected error joining activity:', e);
        return { error: 'An unexpected error occurred while joining.' };
    }
}

/**
 * Cancel RSVP for an activity.
 */
export async function cancelRsvp(activityId) {
    const session = await auth();
    if (!session?.user?.email) return { error: 'Unauthorized' };

    const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single();

    try {
        const { error } = await supabase
            .from('activity_participants')
            .delete()
            .eq('activity_id', activityId)
            .eq('user_id', userData.id);

        if (error) {
            console.error('Error cancelling RSVP:', error.message, error.details);
            return { error: `Failed to cancel: ${error.message}` };
        }

        revalidatePath('/dashboard/society');
        return { success: true };
    } catch (e) {
        console.error('Unexpected error cancelling RSVP:', e);
        return { error: 'An unexpected error occurred while cancelling.' };
    }
}
