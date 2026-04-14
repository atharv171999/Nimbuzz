'use server';

import { auth } from '@/auth';
import { sendMessage, getMessagesWithUser } from '@/app/lib/db';
import { revalidatePath } from 'next/cache';

export async function sendChatMessage(targetEmail, content) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'Unauthorized', success: false };
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
        return { error: 'Message cannot be empty', success: false };
    }

    try {
        await sendMessage(session.user.email, targetEmail, content.trim());
        revalidatePath(`/dashboard/messages`);
        return { success: true };
    } catch (e) {
        return { error: 'Failed to send message', success: false };
    }
}

export async function fetchMessages(targetEmail) {
    const session = await auth();
    
    if (!session?.user?.email) {
        return { error: 'Unauthorized', messages: [] };
    }

    try {
        const msgs = await getMessagesWithUser(session.user.email, targetEmail);
        return { success: true, messages: msgs };
    } catch (e) {
        return { error: 'Failed to fetch messages', messages: [] };
    }
}
