'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ActivityCard from '../components/ActivityCard';
import CreateActivityModal from '../components/CreateActivityModal';

export default function SocietyClientPage({ initialActivities, initialFilters, currentUserEmail }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [areaSearch, setAreaSearch] = useState(initialFilters.area);
    const router = useRouter();

    const categories = ['All', 'Sports', 'Coffee', 'Tech', 'Music', 'Exploration'];

    const handleCategoryChange = (cat) => {
        const params = new URLSearchParams();
        if (cat !== 'All') params.set('category', cat);
        if (areaSearch) params.set('area', areaSearch);
        router.push(`/dashboard/society?${params.toString()}`);
    };

    const handleAreaSearch = (e) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams();
            if (initialFilters.category !== 'All') params.set('category', initialFilters.category);
            if (areaSearch) params.set('area', areaSearch);
            router.push(`/dashboard/society?${params.toString()}`);
        }
    };

    return (
        <div className="flex flex-col min-h-full w-full bg-zinc-50 dark:bg-zinc-950 relative p-6 md:p-12 transition-colors duration-500">
            
            {/* Header & Filter Bar */}
            <div className="max-w-6xl mx-auto w-full mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <h1 className="text-5xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 dark:text-white tracking-tighter">Society</h1>
                    <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px]">Discover local pings and join activities</p>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-black uppercase tracking-widest text-sm rounded-[2rem] hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Ping
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-6xl mx-auto w-full mb-12 flex flex-col md:flex-row items-center gap-6 pb-12 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                ${initialFilters.category === cat 
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                    : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-primary/50'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        placeholder="Search Area..."
                        value={areaSearch}
                        onChange={(e) => setAreaSearch(e.target.value)}
                        onKeyDown={handleAreaSearch}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[1.5rem] py-4 pl-12 pr-6 text-sm font-black tracking-tight focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* Activity Grid */}
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialActivities.length === 0 ? (
                    <div className="col-span-full py-24 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-8 shadow-xl shadow-zinc-200/50 dark:shadow-none transition-transform hover:scale-110 duration-500">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <h2 className="text-3xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 dark:text-white mb-2 tracking-tighter">No Pings Yet</h2>
                        <p className="text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Start an activity in your area</p>
                    </div>
                ) : (
                    initialActivities.map(act => (
                        <ActivityCard key={act.id} activity={act} currentUserEmail={currentUserEmail} />
                    ))
                )}
            </div>

            {/* Creation Modal */}
            <CreateActivityModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />

            {/* Bottom Spacer for Mobile Nav */}
            <div className="h-24 lg:hidden" />
        </div>
    );
}
