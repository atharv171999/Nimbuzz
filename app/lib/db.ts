import { supabase } from './supabase';

export interface User {
    id: string; // Will correspond to Supabase UUID
    name?: string;
    username?: string;
    email: string;
    password?: string;
    date_of_birth?: string;
    bio?: string;
    gender?: string;
    profile_picture?: string;
    created_at?: string;
}

export interface Post {
    id?: string;
    user_email: string;
    image_url: string;
    caption?: string;
    created_at?: string;
    likes_count?: number;
    user_has_liked?: boolean;
}

export interface Message {
    id?: string;
    sender_email: string;
    receiver_email: string;
    content: string;
    created_at?: string;
}

export async function getUsers(limit = 20): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(limit);

    if (error) {
        console.error('Error fetching users from Supabase:', error);
        return [];
    }

    return data || [];
}

export async function getUsersByEmails(emails: string[]): Promise<User[]> {
    if (emails.length === 0) return [];
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('email', emails);

    if (error) {
        console.error('Error fetching users by emails:', error);
        return [];
    }

    return data || [];
}

export async function getUser(email: string): Promise<User | undefined> {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user from Supabase:', error.message || error);
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

export async function updateUser(email: string, userUpdates: Partial<User>): Promise<void> {
    const { error } = await supabase
        .from('users')
        .update(userUpdates)
        .eq('email', email);

    if (error) {
        console.error('Error updating user in Supabase:', error);
        throw error;
    }
}

export async function createPost(post: Partial<Post>): Promise<void> {
    const { error } = await supabase
        .from('posts')
        .insert([
            {
                user_email: post.user_email,
                image_url: post.image_url,
                caption: post.caption,
            }
        ]);

    if (error) {
        console.error('Error creating post in Supabase:', error);
        throw error;
    }
}

export async function deletePost(postId: string): Promise<void> {
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    if (error) {
        console.error('Error deleting post in Supabase:', error);
        throw error;
    }
}

export async function getPosts(): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts from Supabase:', error);
        return [];
    }

    return data || [];
}

export async function getPostsByEmail(email: string): Promise<Post[]> {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_email', email)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching user posts from Supabase:', error);
        return [];
    }

    return data || [];
}

export async function getFeedPosts(userEmail: string, limit = 10): Promise<Post[]> {
    // 1. Get list of emails the user is following
    const { data: follows, error: followsError } = await supabase
        .from('follows')
        .select('following_email')
        .eq('follower_email', userEmail);
        
    if (followsError) {
        console.error('Error fetching follows for feed:', followsError);
        return [];
    }
    
    // 2. Extract emails array, including the user's own email
    const emailsToFetch = [userEmail, ...(follows || []).map(f => f.following_email)];
    
    // 3. Fetch posts matching any of those emails
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .in('user_email', emailsToFetch)
        .order('created_at', { ascending: false })
        .limit(limit);
        
    if (postsError || !posts) {
        console.error('Error fetching feed posts:', postsError);
        return [];
    }
    
    if (posts.length === 0) return [];

    const postIds = posts.map(p => p.id);

    // 4. Bulk fetch like counts
    const { data: likeCounts, error: countError } = await supabase
        .from('post_likes')
        .select('post_id');
    
    // Note: In a production environment with many likes, we should use a RPC or a more optimized aggregate query.
    // For now, we'll manually aggregate the fetched likes for these posts to avoid N+1.
    // Actually, a better bulk way without RPC:
    const { data: allLikesForPosts } = await supabase
        .from('post_likes')
        .select('post_id, user_email')
        .in('post_id', postIds);

    const likesMap = new Map();
    const userLikedSet = new Set();

    if (allLikesForPosts) {
        allLikesForPosts.forEach(like => {
            likesMap.set(like.post_id, (likesMap.get(like.post_id) || 0) + 1);
            if (like.user_email === userEmail) {
                userLikedSet.add(like.post_id);
            }
        });
    }

    // 5. Combine data
    const postsWithLikes = posts.map(post => ({
        ...post,
        likes_count: likesMap.get(post.id) || 0,
        user_has_liked: userLikedSet.has(post.id)
    }));
    
    return postsWithLikes;
}

export async function toggleLike(postId: string, userEmail: string): Promise<void> {
    const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .match({ post_id: postId, user_email: userEmail })
        .maybeSingle();

    if (existingLike) {
        await supabase
            .from('post_likes')
            .delete()
            .match({ post_id: postId, user_email: userEmail });
    } else {
        await supabase
            .from('post_likes')
            .insert([{ post_id: postId, user_email: userEmail }]);
    }
}

export async function getPostLikeData(postId: string, userEmail?: string) {
    const { count: likesCount } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId);

    let userHasLiked = false;
    if (userEmail) {
        const { data } = await supabase
            .from('post_likes')
            .select('id')
            .match({ post_id: postId, user_email: userEmail })
            .maybeSingle();
        userHasLiked = !!data;
    }

    return { likesCount: likesCount || 0, userHasLiked };
}

export async function searchUsers(query: string): Promise<User[]> {
    if (!query) return [];
    
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`username.ilike.%${query}%,name.ilike.%${query}%`)
        .limit(20);

    if (error) {
        console.error('Error searching users in Supabase:', error);
        return [];
    }

    return data || [];
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user by username from Supabase:', error.message || error);
        return undefined;
    }

    return user;
}

export async function followUser(followerEmail: string, followingEmail: string): Promise<void> {
    const { error } = await supabase
        .from('follows')
        .insert([{ follower_email: followerEmail, following_email: followingEmail }]);
        
    if (error) {
        console.error('Error following user:', error);
        throw error;
    }
}

export async function unfollowUser(followerEmail: string, followingEmail: string): Promise<void> {
    const { error } = await supabase
        .from('follows')
        .delete()
        .match({ follower_email: followerEmail, following_email: followingEmail });
        
    if (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
}

export async function checkIsFollowing(followerEmail: string, followingEmail: string): Promise<boolean> {
    // using maybeSingle because single() throws error if 0 rows found
    const { data, error } = await supabase
        .from('follows')
        .select('id')
        .match({ follower_email: followerEmail, following_email: followingEmail })
        .maybeSingle();
        
    if (error) {
        console.error('Error checking follow status:', error);
        return false;
    }
    
    return !!data;
}

export async function getFollowerCount(userEmail: string): Promise<number> {
    const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_email', userEmail);
    
    if (error) {
        console.error('Error fetching follower count:', error);
        return 0;
    }
    return count || 0;
}

export async function getFollowingCount(userEmail: string): Promise<number> {
    const { count, error } = await supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_email', userEmail);
        
    if (error) {
        console.error('Error fetching following count:', error);
        return 0;
    }
    return count || 0;
}

export async function sendMessage(senderEmail: string, receiverEmail: string, content: string): Promise<void> {
    const { error } = await supabase
        .from('messages')
        .insert([{ sender_email: senderEmail, receiver_email: receiverEmail, content }]);
        
    if (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

export async function getMessagesWithUser(user1Email: string, user2Email: string): Promise<Message[]> {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_email.eq.${user1Email},receiver_email.eq.${user2Email}),and(sender_email.eq.${user2Email},receiver_email.eq.${user1Email})`)
        .order('created_at', { ascending: true });
        
    if (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
    return data || [];
}

export async function getChatContacts(userEmail: string): Promise<User[]> {
    // Contact list: Anyone you follow, or anyone who follows you
    const { data: following } = await supabase
        .from('follows')
        .select('following_email')
        .eq('follower_email', userEmail);
        
    const { data: followers } = await supabase
        .from('follows')
        .select('follower_email')
        .eq('following_email', userEmail);
        
    const contactEmails = new Set<string>();
    if (following) following.forEach(f => contactEmails.add(f.following_email));
    if (followers) followers.forEach(f => contactEmails.add(f.follower_email));
    
    // Safety check: Ensure the user doesn't chat with themselves
    contactEmails.delete(userEmail);
    
    if (contactEmails.size === 0) return [];
    
    const { data: users, error: userErr } = await supabase
        .from('users')
        .select('*')
        .in('email', Array.from(contactEmails));
        
    if (userErr || !users) {
        console.error('Error fetching chat contacts:', userErr);
        return [];
    }

    // Now securely fetch recent messages linked to this user to arrange by recency
    const { data: messages } = await supabase
        .from('messages')
        .select('sender_email, receiver_email, created_at')
        .or(`sender_email.eq.${userEmail},receiver_email.eq.${userEmail}`)
        .order('created_at', { ascending: false })
        .limit(500); // Sufficient for recent sorting without fetching thousands

    const lastMessageMap = new Map<string, number>();

    if (messages) {
        messages.forEach(msg => {
            const time = new Date(msg.created_at).getTime();
            const contactEmail = msg.sender_email === userEmail ? msg.receiver_email : msg.sender_email;
            
            // Since we ordered by descending, the first one we find is the latest
            if (!lastMessageMap.has(contactEmail)) {
                lastMessageMap.set(contactEmail, time);
            }
        });
    }

    // Sort users descending by their last mapped chronological activity
    users.sort((a, b) => {
        const timeA = lastMessageMap.get(a.email) || 0;
        const timeB = lastMessageMap.get(b.email) || 0;
        return timeB - timeA;
    });
    
    return users;
}
