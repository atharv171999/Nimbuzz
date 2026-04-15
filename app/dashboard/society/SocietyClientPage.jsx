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
        <div className="flex flex-col min-h-full w-full bg-slate-50 relative p-4 md:p-8">
            
            {/* Header & Filter Bar */}
            <div className="max-w-6xl mx-auto w-full mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Society</h1>
                    <p className="text-slate-500 font-medium tracking-tight">Discover local pings and join activities in your area.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-zinc-950 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Create Ping
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="max-w-6xl mx-auto w-full mb-8 flex flex-col md:flex-row items-center gap-4">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all
                                ${initialFilters.category === cat 
                                    ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-zinc-300'
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input 
                        placeholder="Search City or Area..."
                        value={areaSearch}
                        onChange={(e) => setAreaSearch(e.target.value)}
                        onKeyDown={handleAreaSearch}
                        className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
                    />
                </div>
            </div>

            {/* Activity Grid */}
            <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialActivities.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 transition-transform hover:rotate-12">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-slate-300"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">No Pings Found</h2>
                        <p className="text-slate-500 max-w-sm">Be the first to start an activity in your area!</p>
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
