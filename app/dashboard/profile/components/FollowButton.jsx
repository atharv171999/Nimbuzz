'use client';

import { useTransition, useState } from 'react';
import { toggleFollowAction } from '@/app/actions/follow';

export default function FollowButton({ initialIsFollowing, targetEmail }) {
    const [isPending, startTransition] = useTransition();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const handleToggle = () => {
        // Optimistically update
        const newState = !isFollowing;
        setIsFollowing(newState);
        
        startTransition(async () => {
            const res = await toggleFollowAction(targetEmail, !newState);
            if (!res.success) {
                // Revert on error
                setIsFollowing(!newState);
                alert(res.error || 'Failed to update follow status');
            }
        });
    };

    if (isFollowing) {
        return (
            <button 
                onClick={handleToggle}
                disabled={isPending}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
                Following
            </button>
        );
    }

    return (
        <button 
            onClick={handleToggle}
            disabled={isPending}
            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-sm font-semibold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
            Follow
        </button>
    );
}
