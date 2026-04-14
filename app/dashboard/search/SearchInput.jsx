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
        <div className="relative w-full max-w-xl mb-6 shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <svg className="h-5 w-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
                type="text"
                autoFocus
                placeholder="Search usernames..."
                value={inputValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 focus:bg-white sm:text-lg transition-all shadow-sm"
            />
        </div>
    );
}
