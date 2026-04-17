import { getUsers, getFeedPosts } from '@/app/lib/db';
import FeedPost from './components/FeedPost';
import { auth } from '@/auth';
import MobileHeader from './components/MobileHeader';


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
        <div className="flex flex-col min-h-full pt-30 items-center py-5 w-full relative">
            <MobileHeader/>
            <div className="w-full max-w-3xl flex flex-col items-center pb-20 px-4 md:px-0">
                {posts.length === 0 ? (
                    <div className="mt-24 flex flex-col items-center justify-center p-12 text-center bg-white/50 border border-zinc-200 rounded-[2.5rem] shadow-sm backdrop-blur-sm">
                        <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 shadow-xl shadow-primary/5 transition-transform hover:scale-110 duration-500">
                            <CameraIcon className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 mb-2 tracking-tighter">Your Feed is Empty</h2>
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] max-w-[200px]">Follow users to see their project highlights here</p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col items-center">
                        {posts.map((post) => (
                            <FeedPost 
                                key={post.id} 
                                post={post} 
                                author={usersByEmail[post.user_email]} 
                                currentUserEmail={email}
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