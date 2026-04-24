'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import CreatePostModal from './CreatePostModal';
import { useState } from "react";

export default function BottomNav({ user }) {
    const pathname = usePathname();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const isChatOpen = pathname.startsWith('/dashboard/messages/') && pathname !== '/dashboard/messages';

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: HomeIcon },
        { name: 'Messages', href: '/dashboard/messages', icon: MessagesIcon },
        { name: 'Society', href: '/dashboard/society', icon: UsersIcon },
        { name: 'Profile', href: '/dashboard/profile', icon: ProfileIcon, isProfile: true },
    ];

    if (isChatOpen) return null;

    return (
        <>
            <div className="lg:hidden fixed bottom-6 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
                <nav className="pointer-events-auto flex items-center bg-white/80 backdrop-blur-xl border border-white/40 px-6 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.12)] gap-8">
                    {navItems.slice(0, 2).map((item) => {
                        const Icon = item.icon;
                        const isActive = item.isProfile ? pathname === item.href : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`relative p-2 rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'text-primary scale-110' 
                                    : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                            >
                                {item.isProfile ? (
                                    <div className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200'} relative shadow-sm`}>
                                        {user?.profile_picture ? (
                                            <Image 
                                                src={user.profile_picture} 
                                                alt="Profile" 
                                                fill
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                ) : (
                                    <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                                )}
                                
                                {isActive && !item.isProfile && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                                )}
                                
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-tighter">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Create Post Action in Center */}
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-3 bg-primary rounded-2xl text-white shadow-lg shadow-primary/25 active:scale-90 transition-all hover:rotate-90 duration-500 mx-1"
                    >
                        <PlusIcon className="w-6 h-6 stroke-[3px]" />
                    </button>

                    {navItems.slice(2).map((item) => {
                        const Icon = item.icon;
                        const isActive = item.isProfile ? pathname === item.href : pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`relative p-2 rounded-xl transition-all duration-300 group ${
                                    isActive 
                                    ? 'text-primary scale-110' 
                                    : 'text-zinc-400 hover:text-zinc-600'
                                }`}
                            >
                                {item.isProfile ? (
                                    <div className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all ${isActive ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200'} relative shadow-sm`}>
                                        {user?.profile_picture ? (
                                            <Image 
                                                src={user.profile_picture} 
                                                alt="Profile" 
                                                fill
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-zinc-200" />
                                        )}
                                    </div>
                                ) : (
                                    <Icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                                )}
                                
                                {isActive && !item.isProfile && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                                )}
                                
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-tighter">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
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

const HomeIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>);
const UsersIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const MessagesIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
const PlusIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const ProfileIcon = () => null; // Placeholder as we use the image
