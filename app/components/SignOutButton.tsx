'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
    const handleSignOut = () => {
        signOut({ callbackUrl: '/login' });
    };

    return (
        <button
            onClick={handleSignOut}
            className="mt-4 rounded-full bg-red-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        >
            Sign Out
        </button>
    );
}
