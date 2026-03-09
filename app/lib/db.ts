import { supabase } from './supabase';

export interface User {
    id: string; // Will correspond to Supabase UUID
    name?: string;
    username?: string;
    email: string;
    password?: string;
    date_of_birth?: string;
    created_at?: string;
}

export async function getUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.error('Error fetching users from Supabase:', error);
        return [];
    }

    return data || [];
}

export async function getUser(email: string): Promise<User | undefined> {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) {
        console.error('Error fetching user from Supabase:', error);
        return undefined;
    }

    return user;
}

export async function createUser(user: Partial<User>): Promise<void> {
    const { error } = await supabase
        .from('users')
        .insert([
            {
                name: user.name,
                username: user.username,
                email: user.email,
                password: user.password,
                date_of_birth: user.date_of_birth,
                // Do not pass id if Supabase relies on auto-generating UUIDs
                ...(user.id ? { id: user.id } : {})
            }
        ]);

    if (error) {
        console.error('Error creating user in Supabase:', error);
        throw error;
    }
}
