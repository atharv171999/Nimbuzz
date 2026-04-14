import { getUsers, getFeedPosts } from '@/app/lib/db';
import FeedPost from './components/FeedPost';
import { auth } from '@/auth';

export default async function DashboardPage() {
    const session = await auth();
    const email = session?.user?.email;

    // Fetch posts belonging to user and their network
    const [posts, users] = await Promise.all([
        email ? getFeedPosts(email) : Promise.resolve([]),
        getUsers()
    ]);

    // Fast O(1) dictionary lookup since we don't have SQL JOIN policies enabled perfectly yet
    const usersByEmail = users.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
    }, {});

    return (
        <div className="flex flex-col min-h-full items-center py-10 w-full relative">
            
            {/* Header branding visible mainly on mobile */}
            <div className="w-full max-w-[470px] flex items-center justify-between mb-8 px-4 md:hidden">
                <span className="font-black text-2xl drop-shadow-md text-zinc-900">
                    Nimbus
                </span>
                <CameraIcon className="w-6 h-6 text-white" />
            </div>
            
            <div className="w-full max-w-3xl flex flex-col items-center pb-20 px-4 md:px-0">
                {posts.length === 0 ? (
                    <div className="mt-20 flex flex-col items-center justify-center p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <CameraIcon className="w-16 h-16 text-slate-300 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Posts Yet</h2>
                        <p className="text-slate-500 max-w-xs">When you or your friends publish photos, they will appear right here in your feed.</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {posts.map((post) => (
                            <FeedPost 
                                key={post.id} 
                                post={post} 
                                author={usersByEmail[post.user_email]} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const CameraIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
        <circle cx="12" cy="13" r="3"></circle>
    </svg>
);