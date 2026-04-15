'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav({ user }) {
    const pathname = usePathname();

    return (
        <nav className="lg:hidden h-16 w-full fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-50">
            <NavItem href="/dashboard" icon={<HomeIcon />} isActive={pathname === "/dashboard"} />
            <NavItem href="/dashboard/search" icon={<SearchIcon />} isActive={pathname === "/dashboard/search"} />
            <NavItem href="/dashboard/society" icon={<UsersIcon />} isActive={pathname === "/dashboard/society"} />
            <button className="flex items-center justify-center p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors">
                <PlusIcon className="w-7 h-7" />
            </button>
            <NavItem href="/dashboard/messages" icon={<MessagesIcon />} isActive={pathname === "/dashboard/messages"} />
            <NavItem 
                href="/dashboard/profile" 
                isActive={pathname === "/dashboard/profile"}
                icon={
                    <div className="h-7 w-7 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative shadow-sm">
                        {user?.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-200" />
                        )}
                    </div>
                } 
            />
        </nav>
    );
}

function NavItem({ href, icon, isActive }) {
    return (
        <Link 
            href={href} 
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all ${isActive ? 'text-zinc-900 scale-110' : 'text-slate-500 hover:text-slate-900'}`}
        >
            <div className="w-7 h-7">
                {icon}
            </div>
        </Link>
    );
}

const HomeIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" /><polyline points="9 22 9 12 15 12 15 22" fill="none" /></svg>);
const SearchIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><circle cx="10" cy="10" r="7" /><line x1="21" y1="21" x2="15" y2="15" /></svg>);
const UsersIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const MessagesIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
const PlusIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>);
