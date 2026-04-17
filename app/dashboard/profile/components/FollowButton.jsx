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
                className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
                Following
            </button>
        );
    }

    return (
        <button 
            onClick={handleToggle}
            disabled={isPending}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover rounded-2xl text-sm font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
        >
            Follow
        </button>
    );
}
