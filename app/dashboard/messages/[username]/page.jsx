import { getUserByUsername } from '@/app/lib/db';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import ChatUI from './ChatUI';
import { fetchMessages } from '@/app/actions/chat';

export default async function ActiveChatPage({ params }) {
    const resolvedParams = await params;
    const { username } = resolvedParams;
    
    const [targetUser, session] = await Promise.all([
        getUserByUsername(username),
        auth()
    ]);

    if (!targetUser || !session?.user?.email) {
        return notFound();
    }

    // Fetch initial chat history
    const history = await fetchMessages(targetUser.email);
    const initialMessages = history.success ? history.messages : [];

    return (
        <ChatUI 
            initialMessages={initialMessages} 
            myEmail={session.user.email} 
            targetUser={targetUser} 
        />
    );
}
