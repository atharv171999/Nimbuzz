'use client';

import Image from 'next/image';

export default function FeedPost({ post, author }) {
    
    // Force a strict locale to prevent Next.js server/client hydration mismatches
    const timeAgo = post.created_at 
        ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Just now';

    return (
        <div className="w-full max-w-[470px] lg:mx-auto bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-[2.5rem] overflow-hidden mb-8 lg:mb-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-none flex flex-col group transition-all duration-300">
            
            {/* Post Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-50 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative shrink-0 shadow-sm transition-all group-hover:border-primary/20">
                        {author?.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={author.profile_picture} alt={author?.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 group-hover:scale-110 transition-transform" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-zinc-900 dark:text-white tracking-tight cursor-pointer hover:text-primary transition-colors">
                            {author?.username || author?.name || post.user_email.split('@')[0]}
                        </span>
                    </div>
                </div>
                <button className="p-2 hover:bg-primary/5 rounded-full transition-all text-zinc-400 hover:text-primary">
                    <MoreHorizontalIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Post Image Focus (Conditional) */}
            {post.image_url && post.image_url.trim() !== '' && (
                <div className="w-full aspect-square relative bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                </div>
            )}

            {/* Post Footer Actions */}
            <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-all duration-300">
                            <HeartIcon className="w-[30px] h-[30px]" />
                        </button>
                        <button className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-all duration-300">
                            <MessageCircleIcon className="w-[30px] h-[30px]" />
                        </button>
                        <button className="text-zinc-500 dark:text-zinc-400 hover:text-primary transition-all duration-300">
                            <SendIcon className="w-[30px] h-[30px]" />
                        </button>
                    </div>
                    <button className="text-zinc-500 dark:text-zinc-400 hover:text-primary hover:-translate-y-1 transition-all duration-300">
                        <BookmarkIcon className="w-[28px] h-[28px]" />
                    </button>
                </div>

                <div className="text-sm font-black text-zinc-900 dark:text-white tracking-wide ml-1">
                    0 likes
                </div>

                {/* Caption Block */}
                {post.caption && (
                    <div className={`text-sm text-zinc-600 dark:text-zinc-300 mt-1 ml-1 leading-relaxed ${!post.image_url || post.image_url.trim() === '' ? 'text-[16px] font-medium leading-relaxed pb-2 text-zinc-800 dark:text-zinc-200' : ''}`}>
                        {post.image_url && post.image_url.trim() !== '' && (
                            <span className="font-black text-zinc-900 dark:text-white mr-2">
                                {author?.username || author?.name || post.user_email.split('@')[0]}
                            </span>
                        )}
                        {post.caption}
                    </div>
                )}
                
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1 mt-1">
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
