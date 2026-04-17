'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toggleLikePostAction, deletePostAction } from '@/app/actions/post';

export default function FeedPost({ post, author, currentUserEmail }) {
    const [isLiked, setIsLiked] = useState(post.user_has_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const isOwner = currentUserEmail === post.user_email;

    // Sync with server data when post changes
    useEffect(() => {
        setIsLiked(post.user_has_liked || false);
        setLikesCount(post.likes_count || 0);
    }, [post.user_has_liked, post.likes_count]);

    const handleLike = async () => {
        // Optimistic UI update
        const newIsLiked = !isLiked;
        const newLikesCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
        
        setIsLiked(newIsLiked);
        setLikesCount(newLikesCount);

        try {
            const result = await toggleLikePostAction(post.id);
            if (result.error) {
                // Revert on error
                setIsLiked(isLiked);
                setLikesCount(likesCount);
            }
        } catch (error) {
            setIsLiked(isLiked);
            setLikesCount(likesCount);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        setIsDeleting(true);
        setIsHidden(true); // Optimistically hide
        
        try {
            const result = await deletePostAction(post.id);
            if (result.error) {
                alert(result.error);
                setIsHidden(false); // Show again on error
            }
        } catch (error) {
            alert('Failed to delete post');
            setIsHidden(false);
        } finally {
            setIsDeleting(false);
            setShowMenu(false);
        }
    };

    if (isHidden) return null;
    
    // Force a strict locale to prevent Next.js server/client hydration mismatches
    const timeAgo = post.created_at 
        ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
        : 'Just now';

    // return (
    return (
        <div className="w-full max-w-[470px] lg:mx-auto bg-white border-2 border-zinc-300/90 rounded-[2.5rem] overflow-hidden mb-8 lg:mb-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-300">
            
            {/* Post Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-300">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-50 bg-zinc-100 relative shrink-0 shadow-sm transition-all ">
                        {author?.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={author.profile_picture} alt={author?.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 transition-transform" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-black text-zinc-900 tracking-tight cursor-pointer hover:text-primary transition-colors">
                            {author?.username || author?.name || post.user_email.split('@')[0]}
                        </span>
                    </div>
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 hover:bg-zinc-100 rounded-full transition-all text-zinc-400 hover:text-zinc-600"
                    >
                        <MoreHorizontalIcon className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <>
                            <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
                            <div className="absolute right-0 mt-2 w-28 bg-white border border-zinc-200 rounded-2xl shadow-xl z-30  overflow-hidden animate-in fade-in zoom-in duration-200">
                                {isOwner ? (
                                    <button 
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 text-xs font-semibold uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setShowMenu(false)}
                                        className="w-full text-left px-4 py-3 text-zinc-600 hover:bg-zinc-50 text-sm font-black uppercase tracking-widest transition-colors"
                                    >
                                        Report Post
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Post Image Focus (Conditional) */}
            {post.image_url && post.image_url.trim() !== '' && (
                <div className="w-full aspect-square relative bg-zinc-50 flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={post.image_url} 
                        alt="Post content" 
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                    />
                </div>
            )}

            {/* Post Footer Actions */}
            <div className="p-5 border-t border-zinc-300 flex flex-col gap-4">
                {/* Caption Block */}
                {post.caption && (
                    <div className={`text-sm text-zinc-600 mt-1  ml-1 leading-relaxed ${!post.image_url || post.image_url.trim() === '' ? 'text-[16px] font-medium leading-relaxed pb-2 text-zinc-800' : ''}`}>
                        {post.image_url && post.image_url.trim() !== '' && (
                            <span className="font-black text-zinc-900 mr-2">
                                {author?.username || author?.name || post.user_email.split('@')[0]}
                            </span>
                        )}
                        {post.caption}
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleLike}
                            className={`transition-all duration-300 ${isLiked ? 'text-primary' : 'text-zinc-500 hover:text-primary'}`}
                        >
                            <ThumbsUpIcon className="w-[30px] h-[30px]" filled={isLiked} />
                        </button>
                    </div>
                    <button className="text-zinc-500 hover:text-primary hover:-translate-y-1 transition-all duration-300">
                        <BookmarkIcon className="w-[28px] h-[28px]" />
                    </button>
                </div>

                <div className="text-sm font-black text-zinc-900 tracking-wide ml-1">
                    {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </div>
                <div className="text-[10px] uppercase font-black tracking-[0.2em] text-zinc-400 ml-1 mt-1">
                    {timeAgo}
                </div>
            </div>

        </div>
    );
}

// Inline SVGs to avoid package dependency errors

const ThumbsUpIcon = ({ className, filled }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
    </svg>
);
const BookmarkIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>);
const MoreHorizontalIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>);
const TrashIcon = ({ className }) => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>);
