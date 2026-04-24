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
            <aside className="hidden lg:flex w-[80px] xl:w-[280px] h-full flex-col justify-between border-r border-zinc-200 bg-white/90 backdrop-blur-xl text-zinc-800 transition-all duration-500 z-50">
                <div className="flex flex-col pt-8 pb-4">
                    {/* Identity area */}
                    <div className="flex items-center px-4 xl:px-8 mb-12 h-14 w-full">
                        <Link
                            href="/dashboard"
                            className="hidden xl:flex items-center gap-3 font-[family-name:var(--font-outfit)] font-black text-2xl tracking-tighter text-zinc-900 drop-shadow-sm group transition-all"
                        >
                            <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:bg-primary-hover group-hover:rotate-12 transition-all">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                            </div>
                            Nimbuzz
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
                            href="/dashboard/profile"
                            label="Profile"
                            isActive={pathname === "/dashboard/profile"}
                            icon={
                                <div className="h-6 w-6 rounded-full overflow-hidden border border-slate-200 relative bg-slate-100">
                                    {user?.profile_picture ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <Image 
                                            src={user.profile_picture} 
                                            alt="Profile" 
                                            fill
                                            className="object-cover" 
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-200" />
                                    )}
                                </div>
                            }
                        />
                        <button 
                            onClick={() => setIsCreateModalOpen(true)}
                            className="group flex items-center p-3.5 rounded-2xl transition-all font-bold text-zinc-500 hover:text-primary hover:bg-primary/5 mt-4"
                        >
                            <div className="flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-110 group-active:scale-95 text-zinc-400 group-hover:text-primary">
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
            className={`group flex items-center p-3.5 rounded-[1.25rem] transition-all duration-300 ${isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "font-bold text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"}`}
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
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
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


