'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { searchUsersAction, getAllUsersAction } from '@/app/actions/user';

export default function MobileHeader() {
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const router = useRouter();

    // Initial and Debounced Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (!isSearching) return;

            if (!query.trim()) {
                setIsLoading(true);
                try {
                    const users = await getAllUsersAction();
                    setResults(users);
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            const timer = setTimeout(async () => {
                setIsLoading(true);
                try {
                    const users = await searchUsersAction(query);
                    setResults(users);
                } catch (err) {
                    console.error(err);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300);

            return () => clearTimeout(timer);
        };

        fetchResults();
    }, [query, isSearching]);

    // Auto-focus input
    useEffect(() => {
        if (isSearching && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isSearching]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                // Keep search active but clear results if user clicks away
                // or just close the search entirely if that's the preferred UX
                // setResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
            closeSearch();
        }
    };

    const closeSearch = () => {
        setIsSearching(false);
        setQuery('');
        setResults([]);
    };

    const handleUserSelect = (username) => {
        router.push(`/dashboard/profile/${username}`);
        closeSearch();
    };

    return (
        <div className="lg:hidden fixed top-4 inset-x-0 z-50 px-4 flex flex-col items-center pointer-events-none">
            {/* Header Pill */}
            <header className={`pointer-events-auto h-14 w-full max-w-sm flex items-center transition-all duration-500 ease-out bg-white/80 backdrop-blur-xl border border-white/40 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden ${isSearching ? 'px-2' : 'px-6 justify-between'}`}>
                
                {!isSearching ? (
                    <>
                        <Link href="/dashboard" className="font-[family-name:var(--font-outfit)] font-black text-xl tracking-tighter text-zinc-900 flex items-center gap-2 group transition-all duration-500">
                            <div className="bg-primary p-1.5 rounded-lg text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                            </div>
                            <span>Nimbuzz</span>
                        </Link>
                        
                        <button 
                            onClick={() => setIsSearching(true)}
                            className="p-2.5 rounded-full hover:bg-primary/5 text-zinc-500 hover:text-primary transition-all duration-300"
                            title="Explore"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </>
                ) : (
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex-1 relative flex items-center">
                            <div className="absolute left-3 text-primary">
                                {isLoading ? (
                                    <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                )}
                            </div>
                            <input 
                                ref={inputRef}
                                type="text"
                                placeholder="Search users..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-zinc-50 border-none rounded-full py-2 pl-10 pr-4 text-sm font-bold text-zinc-900 placeholder-zinc-400 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={closeSearch}
                            className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </form>
                )}
            </header>

            {/* Live Search Results Dropdown */}
            {isSearching && results.length > 0 && (
                <div 
                    ref={resultsRef}
                    className="pointer-events-auto mt-2 w-full max-w-sm bg-white/95 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col p-2 animate-in fade-in slide-in-from-top-4 duration-300 max-h-[320px] overflow-y-auto no-scrollbar"
                >
                    <div className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-100 mb-2">
                        Suggested Users
                    </div>
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleUserSelect(user.username)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition-all duration-200 group text-left"
                        >
                            <div className="h-10 w-10 rounded-full bg-zinc-100 overflow-hidden shrink-0 border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {user.profile_picture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-black text-xs">
                                        {user.username?.[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <span className="text-sm font-black text-zinc-900 tracking-tight truncate group-hover:text-primary transition-colors">
                                    {user.name || 'Citizen'}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide truncate">
                                    @{user.username || 'unknown'}
                                </span>
                            </div>
                            <div className="text-zinc-300 group-hover:translate-x-1 group-hover:text-primary transition-all duration-300">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </div>
                        </button>
                    ))}
                    
                    {results.length >= 20 && (
                        <button 
                            onClick={handleSearchSubmit}
                            className="w-full text-center py-3 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl transition-all mt-1"
                        >
                            See all results for &quot;{query}&quot;
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
