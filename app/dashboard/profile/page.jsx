import { auth } from '@/auth';
import { getUser, getPostsByEmail, getFollowerCount, getFollowingCount } from '@/app/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SignOutButton } from '@/app/components/SignOutButton';

export default async function ProfilePage() {
    const session = await auth();
    
    if (!session?.user?.email) {
        redirect('/login');
    }

    const [userProfile, userPosts, followersCount, followingCount] = await Promise.all([
        getUser(session.user.email),
        getPostsByEmail(session.user.email),
        getFollowerCount(session.user.email),
        getFollowingCount(session.user.email)
    ]);

    if (!userProfile) {
        return (
            <div className="flex flex-col min-h-full items-center justify-center p-8 text-slate-900">
                <h1 className="text-2xl font-bold">Profile not found</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full items-center py-10 w-full relative">
            <div className="w-full max-w-4xl px-4 md:px-8">
                
                {/* Profile Header Block */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-12 border-b border-slate-200 pb-12 mt-4">
                    {/* Avatar */}
                    <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-full overflow-hidden border border-slate-200 relative bg-slate-100 shadow-sm">
                        {userProfile.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfile.profile_picture} alt={userProfile.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200" />
                        )}
                    </div>

                    {/* Meta Data */}
                    <div className="flex flex-col items-center md:items-start flex-1 gap-4">
                        <div className="flex items-center justify-between w-full mb-2">
                            <h2 className="text-3xl font-black text-zinc-900 tracking-tighter">
                                {userProfile.username || userProfile.name}
                            </h2>
                            
                            {/* Profile Actions - Settings & SignOut (Mobile Accessible) */}
                            <div className="flex items-center gap-3">
                                <Link 
                                    href="/dashboard/settings/personal-account"
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                    title="Settings"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"></path></svg>
                                </Link>
                                
                                <div className="lg:hidden">
                                     <SignOutButton />
                                </div>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-8 mb-2">
                            <div className="text-slate-900 text-base">
                                <span className="font-semibold block md:inline text-center md:text-left">{userPosts.length}</span> <span className="text-slate-500 font-normal">posts</span>
                            </div>
                            <div className="text-slate-900 text-base">
                                <span className="font-semibold block md:inline text-center md:text-left">{followersCount}</span> <span className="text-slate-500 font-normal">followers</span>
                            </div>
                            <div className="text-slate-900 text-base">
                                <span className="font-semibold block md:inline text-center md:text-left">{followingCount}</span> <span className="text-slate-500 font-normal">following</span>
                            </div>
                        </div>

                        {/* Bio / Details */}
                        <div className="flex flex-col items-center md:items-start text-sm">
                            <span className="font-semibold text-slate-900 mb-1">{userProfile.name}</span>
                            {userProfile.bio && (
                                <p className="text-slate-600 whitespace-pre-wrap text-center md:text-left max-w-sm">
                                    {userProfile.bio}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Grid Wrapper Navigation */}
                <div className="flex justify-center border-t border-slate-200 pt-4 mb-6">
                    <button className="text-sm font-semibold tracking-widest uppercase text-slate-900 flex items-center gap-2 px-4 shadow-[0_-2px_0_currentColor]">
                        {/* Generic SVG for Grid layout to mimic IG */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Posts
                    </button>
                </div>

                {/* Image Grid Array */}
                <div className="grid grid-cols-3 gap-1 md:gap-6">
                    {userPosts.map((post) => (
                        <div key={post.id} className="aspect-square relative bg-white border border-slate-200 group cursor-pointer overflow-hidden rounded-sm md:rounded-xl">
                            {post.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                    src={post.image_url} 
                                    alt="Post" 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 text-center group-hover:scale-105 transition-transform duration-500 bg-zinc-50 border border-zinc-100">
                                     <p className="text-[9px] sm:text-xs text-zinc-600 line-clamp-4 leading-relaxed font-semibold">
                                         {post.caption}
                                     </p>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                                <span className="text-white font-bold flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.8 4.6a5.5 5.5 0 00-7.7 0l-1.1 1-1.1-1a5.5 5.5 0 00-7.8 7.8l1 1 7.9 7.8 8-7.8 1-1a5.5 5.5 0 000-7.8z" /></svg>
                                    0
                                </span>
                                {post.caption && (
                                    <span className="text-white font-bold flex items-center gap-2">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21 11.5a8.4 8.4 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.4 8.4 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" /></svg>
                                        0
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {userPosts.length === 0 && (
                    <div className="mt-20 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center mb-4">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-slate-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Photos</h2>
                        <p className="text-slate-500">When you share photos, they will appear on your profile.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
