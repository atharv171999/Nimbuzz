import { auth } from '@/auth';
import { getChatContacts } from '@/app/lib/db';
import { redirect } from 'next/navigation';
import MessagesClient from './MessagesClient';

export default async function MessagesLayout({ children }) {
    const session = await auth();
    if (!session?.user?.email) redirect('/login');

    const contacts = await getChatContacts(session.user.email);

    return (
        <MessagesClient contacts={contacts}>
            {children}
        </MessagesClient>
    );
}
