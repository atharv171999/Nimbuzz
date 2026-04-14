'use client';

import Link from 'next/link';

export default function MobileHeader() {
    return (
        <header className="lg:hidden h-14 w-full flex items-center justify-between px-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
            <Link href="/dashboard" className="font-black text-2xl tracking-tighter text-zinc-900 drop-shadow-sm">
                Nimbus
            </Link>
            
            <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
                    <HeartIcon className="w-6 h-6 text-slate-700" />
                </button>
            </div>
        </header>
    );
}

const HeartIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
