'use client';

import Image from 'next/image';

export default function FeedPost({ post, author }) {
    
    // Force a strict locale to prevent Next.js server/client hydration mismatches
    const timeAgo = post.created_at 
        ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Just now';

    return (
        <div className="w-full max-w-[470px] lg:mx-auto bg-white border border-zinc-200/80 rounded-2xl lg:rounded-3xl overflow-hidden mb-6 lg:mb-10 shadow-sm lg:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] flex flex-col group">
            
            {/* Post Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 relative shrink-0">
                        {author?.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={author.profile_picture} alt={author?.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 group-hover:scale-105 transition-transform" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-900 tracking-tight cursor-pointer hover:opacity-70 transition-opacity">
                            {author?.username || author?.name || post.user_email.split('@')[0]}
                        </span>
                    </div>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Post Image Focus (Conditional) */}
            {post.image_url && post.image_url.trim() !== '' && (
                <div className="w-full aspect-square relative bg-zinc-50 flex items-center justify-center overflow-hidden border-y border-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />
                </div>
            )}

            {/* Post Footer Actions */}
            <div className="p-3 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="text-zinc-600 hover:text-zinc-900 hover:-translate-y-1 transition-all">
                            <HeartIcon className="w-[26px] h-[26px]" />
                        </button>
                        <button className="text-zinc-600 hover:text-zinc-900 hover:-translate-y-1 transition-all">
                            <MessageCircleIcon className="w-[26px] h-[26px]" />
                        </button>
                        <button className="text-zinc-600 hover:text-zinc-900 hover:-translate-y-1 transition-all">
                            <SendIcon className="w-[26px] h-[26px]" />
                        </button>
                    </div>
                    <button className="text-zinc-600 hover:text-zinc-900 hover:-translate-y-1 transition-all">
                        <BookmarkIcon className="w-[26px] h-[26px]" />
                    </button>
                </div>

                <div className="text-sm font-semibold text-slate-900 tracking-wide">
                    0 likes
                </div>

                {/* Caption Block */}
                {post.caption && (
                    <div className={`text-sm text-slate-700 mt-2 ${!post.image_url || post.image_url.trim() === '' ? 'text-[15px] font-normal leading-relaxed pb-2 text-slate-800' : ''}`}>
                        {post.image_url && post.image_url.trim() !== '' && (
                            <span className="font-semibold text-slate-900 mr-2">
                                {author?.username || author?.name || post.user_email.split('@')[0]}
                            </span>
                        )}
                        {post.caption}
                    </div>
                )}
                
                <div className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-2">
                    {timeAgo}
                </div>
            </div>

        </div>
    );
}

// Inline SVGs to avoid package dependency errors

const HeartIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const MessageCircleIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);
const SendIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>);
const BookmarkIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>);
const MoreHorizontalIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>);
