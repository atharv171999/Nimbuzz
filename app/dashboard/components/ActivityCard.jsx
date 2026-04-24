'use client';

import { joinActivity, cancelRsvp, deleteActivity } from '@/app/actions/society';
import { useState } from 'react';
import Image from 'next/image';

export default function ActivityCard({ activity, currentUserEmail }) {
    const [isPending, setIsPending] = useState(false);

    const participants = activity.activity_participants || [];
    const isJoined = participants.some(p => p.user_id === activity.current_user_id);
    const isFull = participants.length >= activity.max_participants;
    const isCreator = activity.creator_id === activity.current_user_id;

    // Formatting date
    const date = new Date(activity.event_time);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const handleJoin = async () => {
        setIsPending(true);
        await joinActivity(activity.id);
        setIsPending(false);
    };

    const handleCancel = async () => {
        setIsPending(true);
        await cancelRsvp(activity.id);
        setIsPending(false);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this community ping?')) return;
        setIsPending(true);
        await deleteActivity(activity.id);
        setIsPending(false);
    };

    // Category Color Mapping
    const categoryColors = {
        'Sports': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Coffee': 'bg-orange-50 text-orange-700 border-orange-100',
        'Tech': 'bg-blue-50 text-blue-700 border-blue-100',
        'Music': 'bg-purple-50 text-purple-700 border-purple-100',
        'Exploration': 'bg-amber-50 text-amber-700 border-amber-100'
    };

    const colorClasses = categoryColors[activity.category] || 'bg-slate-50 text-slate-700 border-slate-100';

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden group">
            {/* Top Bar: Category & Delete */}
            <div className="flex justify-between items-start -m-5 mb-0 px-5 pt-5 relative">
                <div className={`px-3 py-1 rounded-br-xl rounded-tl-xl text-[10px] font-bold uppercase tracking-widest border ${colorClasses}`}>
                    {activity.category}
                </div>

                {isCreator && (
                    <button
                        onClick={handleDelete}
                        disabled={isPending}
                        className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete Ping"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-zinc-900 leading-tight">
                    {activity.title}
                </h3>
                <div className="flex items-center gap-2 text-[13px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 font-bold"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        {dateStr} @ {timeStr}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 font-bold"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {activity.location_name}
                    </span>
                </div>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                {activity.description}
            </p>

            {/* Profile of Creator */}
            <div className="flex items-center gap-2 mt-2">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                    {activity.creator?.profile_picture ? (
                        <div className="relative w-full h-full">
                            <Image 
                                src={activity.creator.profile_picture} 
                                alt="Avatar" 
                                fill
                                className="object-cover" 
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-100" />
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Creator</span>
                    <span className="text-[12px] font-semibold text-slate-700">
                        @{activity.creator?.username || 'unknown'}
                    </span>
                </div>
            </div>

            {/* Participation Progress & List */}
            <div className="mt-2 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    <span>Participants</span>
                    <span>{participants.length} / {activity.max_participants}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${isFull ? 'bg-orange-500' : 'bg-primary'}`}
                        style={{ width: `${(participants.length / activity.max_participants) * 100}%` }}
                    />
                </div>

                {/* Joined Users List */}
                {participants.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center mt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mr-1">Joined:</span>
                        {participants.map((p, idx) => (
                            <span key={idx} className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                @{p.users?.username || 'user'}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-auto pt-4 border-t border-slate-50">
                {isJoined ? (
                    <button
                        onClick={handleCancel}
                        disabled={isPending}
                        className="w-full py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-sm tracking-tight hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {isPending ? 'Processing...' : 'Cancel RSVP'}
                    </button>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={isPending || isFull}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 
                            ${isFull ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover shadow-sm'}
                        `}
                    >
                        {isPending ? 'Processing...' : isFull ? 'Event Full' : 'Join Ping'}
                    </button>
                )}
            </div>
        </div>
    );
}
