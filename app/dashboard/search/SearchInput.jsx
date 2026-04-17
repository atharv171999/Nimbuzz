'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useEffect, useState } from 'react';

export default function SearchInput() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const debounceTimerRef = useRef(null);
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

    // Synchronize state with URL parameters (for external navigation)
    useEffect(() => {
        setInputValue(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = useCallback((term) => {
        setInputValue(term);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (term && term.trim() !== '') {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            router.push(`/dashboard/search?${params.toString()}`);
        }, 350); // 350ms debounce creates a perfectly responsive live-typing feel
    }, [router, searchParams]);

    return (
        <div className="relative w-full max-w-xl mb-6">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
                type="text"
                autoFocus
                placeholder="Search usernames..."
                value={inputValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-14 pr-6 py-5 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] leading-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] dark:shadow-none sm:text-xl font-black tracking-tight"
            />
        </div>
    );
}
