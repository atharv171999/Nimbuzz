"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SignOutButton } from '@/app/components/SignOutButton';
import CreatePostModal from './CreatePostModal';

export default function Sidebar({ user }) {
    const pathname = usePathname();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <>
            <aside className="hidden lg:flex w-[72px] xl:w-[244px] h-full flex-col justify-between border-r border-slate-200 bg-white/70 backdrop-blur-xl text-slate-800 transition-all duration-300">
                <div className="flex flex-col pt-8 pb-4">
                    {/* Identity area */}
                    <div className="flex items-center px-3 xl:px-6 mb-8 h-10 w-full">
                        <Link
                            href="/dashboard"
                            className="hidden xl:block font-black text-[22px] tracking-tighter text-zinc-900 drop-shadow-sm hover:opacity-80 transition-opacity"
                        >
                            {user?.username || user?.name ? `@${user.username || user.name}` : 'Nimbus'}
                        </Link>
                    </div>

                    <nav className="flex flex-col gap-2 px-3">
                        <NavItem
                            href="/dashboard"
                            label="Home"
                            isActive={pathname === "/dashboard"}
                            icon={pathname === "/dashboard" ? <HomeIconActive /> : <HomeIcon />}
                        />
                        <NavItem
                            href="/dashboard/search"
                            label="Explore"
                            isActive={pathname === "/dashboard/search"}
                            icon={<SearchIcon />}
                        />
                        <NavItem
                            href="/dashboard/society"
                            label="Society"
                            isActive={pathname === "/dashboard/society"}
                            icon={<UsersIcon />}
                        />
                        <NavItem
                            href="/dashboard/messages"
                            label="Messages"
                            isActive={pathname === "/dashboard/messages"}
                            icon={<MessagesIcon />}
                        />
                        <NavItem
                            href="/dashboard/notifications"
                            label="Notifications"
                            isActive={pathname === "/dashboard/notifications"}
                            icon={<NotificationsIcon />}
                        />
                        
                        <NavItem
                            href="/dashboard/profile"
                            label="Profile"
                            isActive={pathname === "/dashboard/profile"}
                            icon={
                                <div className="h-6 w-6 rounded-full overflow-hidden border border-slate-200 relative bg-slate-100">
                                    {user?.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-200" />
                                    )}
                                </div>
                            }
                        />
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group flex items-center p-3 rounded-xl transition-all font-normal text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        >
                            <div className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-105 group-active:scale-95 text-slate-500 group-hover:text-slate-900">
                                <PlusIcon />
                            </div>
                            <span className="hidden xl:block ml-4 text-[15px] leading-5 tracking-wide">
                                Create
                            </span>
                        </button>
                    </nav>
                </div>

                <div className="flex flex-col gap-2 px-3 pb-6">
                    <NavItem href="/dashboard/settings/personal-account" label="More" isActive={false} icon={<MoreIcon />} />
                    <SignOutButton />
                </div>
            </aside>
            
            <CreatePostModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                user={user}
            />
        </>
    );
}

function NavItem({
    href,
    label,
    isActive,
    icon,
}) {
    return (
        <Link
            href={href}
            className={`group flex items-center p-3 rounded-xl transition-all duration-300 ${isActive ? "bg-zinc-900 text-white shadow-md shadow-zinc-200/50" : "font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/80"}`}
            title={label}
        >
            <div
                className={`flex items-center justify-center w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-zinc-900"}`}
            >
                {icon}
            </div>
            <span
                className={`hidden xl:block ml-4 text-[15px] leading-5 ${isActive ? "font-semibold tracking-wide" : "tracking-wide"}`}
            >
                {label}
            </span>
        </Link>
    );
}

/* SVG Icons matching the provided image */

const HomeIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" />
        <polyline points="9 22 9 12 15 12 15 22" fill="none" />
    </svg>
);

const HomeIconActive = () => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-full h-full currentColor"
    >
        <path d="M2.5 9.5l9.5-7.5 9.5 7.5v11.5a1 1 0 0 1-1 1h-5.5v-7.5h-6v7.5h-5.5a1 1 0 0 1-1-1v-11.5z" />
    </svg>
);

const ReelsIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <rect x="3" y="4" width="18" height="16" rx="4" ry="4" />
        <polygon points="10 9 15 12 10 15 10 9" />
    </svg>
);

const SearchIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const UsersIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const MessagesIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);

const NotificationsIcon = () => (
    <div className="relative w-full h-full">
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full currentColor"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    </div>
);

const MoreIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

const SettingsIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const PlusIcon = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full currentColor"
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);


