'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function MessagesClient({ contacts, children }) {
    const pathname = usePathname();
    
    // Check if we are in a deep chat route (e.g., /messages/[username])
    const pathParts = pathname.split('/').filter(Boolean);
    const isChatOpen = pathParts.length > 2;

    return (
        <div className="absolute inset-0 flex bg-slate-50 overscroll-none z-10">
            {/* Left Nav Pane - Active Contact Map */}
            <div className={`
                ${isChatOpen ? 'hidden md:flex' : 'flex'} 
                w-full md:w-[340px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden
            `}>
                <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
                    <h1 className="font-bold text-2xl text-slate-900 hidden sm:block">Messages</h1>
                    <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-100 hidden sm:flex">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-slate-700">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.length === 0 ? (
                        <div className="p-8 text-center text-sm text-slate-500 hidden sm:block">
                            <div className="w-12 h-12 rounded-full border-2 border-slate-200 mx-auto flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
                            </div>
                            Follow users to start chatting.
                        </div>
                    ) : (
                        contacts.map(contact => {
                            const linkIdentifier = contact.username || contact.email.split('@')[0];
                            return (
                                <Link
                                    key={contact.email}
                                    href={`/dashboard/messages/${linkIdentifier}`}
                                    className="flex items-center gap-3 p-3 px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-100"
                                >
                                    <div className="relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-50">
                                        {contact.profile_picture ? (
                                            <Image 
                                                src={contact.profile_picture} 
                                                alt={contact.username || 'Contact'} 
                                                fill
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-semibold text-[15px] text-slate-900 truncate">
                                            {contact.name || contact.username || contact.email.split('@')[0]}
                                        </span>
                                        <span className="text-[13px] text-slate-500 truncate">
                                            @{contact.username || contact.email.split('@')[0]}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Active Thread Space */}
            <div className={`flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden ${!isChatOpen ? 'hidden md:flex' : 'flex'}`}>
                {children}
            </div>
        </div>
    );
}
