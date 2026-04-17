'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CreatePostModal from './CreatePostModal';
import { useState } from "react";

export default function BottomNav({ user }) {
    const pathname = usePathname();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isChatOpen = pathname.startsWith('/dashboard/messages/') && pathname !== '/dashboard/messages';

    if (isChatOpen) return null;

    return (
        <>
        
            <div className="lg:hidden fixed bottom-6 inset-x-0 z-50 px-6 flex justify-center pointer-events-none">
                <nav className="pointer-events-auto h-16 w-full max-w-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/40 dark:border-zinc-800/40 flex items-center justify-between px-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-300">
                    <div className="flex items-center gap-4">
                        <NavItem href="/dashboard" icon={<HomeIcon />} isActive={pathname === "/dashboard"} />
                        <NavItem href="/dashboard/messages" icon={<MessagesIcon />} isActive={pathname.startsWith("/dashboard/messages")} />
                    </div>
                    
                    <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all">
                        <PlusIcon className="w-6 h-6" />
                    </button>
    
                    <div className="flex items-center gap-4">
                        <NavItem href="/dashboard/society" icon={<UsersIcon />} isActive={pathname === "/dashboard/society"} />
                        <NavItem 
                            href="/dashboard/profile" 
                            isActive={pathname === "/dashboard/profile"}
                            icon={
                                <div className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all ${pathname === "/dashboard/profile" ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200 dark:border-zinc-700'} relative shadow-sm`}>
                                    {user?.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                                    )}
                                </div>
                            } 
                        />
                    </div>
                </nav>
            </div>
            <CreatePostModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                user={user}
            />
        </>
    );
}

function NavItem({ href, icon, isActive }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center justify-center p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-primary bg-primary/10 scale-110 shadow-sm' : 'text-zinc-400 hover:text-primary hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
        >
            <div className="w-6 h-6">
                {icon}
            </div>
        </Link>
    );
}

const isActive = (active) => active;

const HomeIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" /><polyline points="9 22 9 12 15 12 15 22" fill="none" /></svg>);
const SearchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="10" cy="10" r="7" /><line x1="21" y1="21" x2="15" y2="15" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const MessagesIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
const PlusIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);
