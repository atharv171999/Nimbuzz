import { auth } from '@/auth';
import { getUser, getPostsByEmail, getFollowerCount, getFollowingCount } from '@/app/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ProfileSettings from './components/ProfileSettings';

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
        <div className="flex flex-col min-h-full items-center py-12 lg:py-16 w-full relative">
            <div className="w-full max-w-4xl px-4 md:px-8 relative">
                
                {/* Mobile Settings Access */}
                <div className="absolute right-4 top-0 z-50">
                    <ProfileSettings />
                </div>

                {/* Profile Header Block */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-16 mb-6 border-b border-zinc-200 pb-16 mt-4">
                    {/* Avatar */}
                    <div className="w-36 h-36 md:w-48 md:h-48 shrink-0 rounded-full overflow-hidden border-4 border-white relative bg-zinc-100 shadow-xl shadow-zinc-200/50">
                        {userProfile.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={userProfile.profile_picture} alt={userProfile.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200" />
                        )}
                    </div>

                    {/* Meta Data */}
                    <div className="flex flex-col  items-center md:items-start flex-1 gap-4">
                        <div className="flex items-center justify-center md:justify-start w-full mb-4">
                            <h2 className="text-4xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 tracking-tighter">
                                {userProfile.username || userProfile.name}
                            </h2>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-2  py-3 w-full justify-center md:justify-start">
                            <div className="text-zinc-900 flex flex-col items-center md:items-start">
                                <span className="text-3xl font-[family-name:var(--font-outfit)] font-black text-primary leading-none mb-1">{userPosts.length}</span>
                                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">posts</span>
                            </div>
                            <div className="text-zinc-900 flex flex-col items-center md:items-start px-10">
                                <span className="text-3xl font-[family-name:var(--font-outfit)] font-black text-primary leading-none mb-1">{followersCount}</span>
                                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">followers</span>
                            </div>
                            <div className="text-zinc-900 flex flex-col items-center md:items-start">
                                <span className="text-3xl font-[family-name:var(--font-outfit)] font-black text-primary leading-none mb-1">{followingCount}</span>
                                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">following</span>
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
                <div className="flex justify-center border-zinc-200 pt-6 mb-10">
                    <button className="text-xs font-black tracking-[0.3em] uppercase text-primary flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 transition-all">
                        {/* Generic SVG for Grid layout to mimic IG */}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        Feed Highlights
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-8 lg:gap-12">
                    {userPosts.map((post) => (
                        <div key={post.id} className="aspect-square relative bg-white border border-zinc-200 group cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                            {post.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img 
                                    src={post.image_url} 
                                    alt="Post" 
                                    className="w-full h-full object-cover transition-transform duration-700" 
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center group-hover:scale-110 transition-transform duration-700 bg-zinc-50 border border-zinc-100">
                                     <p className="text-[10px] sm:text-sm text-zinc-500 line-clamp-4 leading-relaxed font-bold uppercase tracking-wider">
                                         {post.caption}
                                     </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {userPosts.length === 0 && (
                    <div className="mt-24 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-zinc-100 flex items-center justify-center mb-6 shadow-xl shadow-zinc-200/50 transition-transform hover:rotate-12 duration-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        </div>
                        <h2 className="text-3xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 mb-3 tracking-tighter">Share your Moments</h2>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Your Highlights will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
}
