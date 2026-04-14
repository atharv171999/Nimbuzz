'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/' });
    };

    return (
        <button
            onClick={handleSignOut}
            className="group w-full flex items-center justify-center p-3 rounded-xl border-2 border-zinc-200 text-[15px] font-semibold text-zinc-600 bg-white hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all duration-300"
        >
            <span className="group-hover:-translate-y-0.5 transition-transform duration-300">Sign Out</span>
        </button>
    );
}
