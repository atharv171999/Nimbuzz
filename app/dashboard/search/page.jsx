import { searchUsers, getUsers } from '@/app/lib/db';
import SearchInput from './SearchInput';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function SearchPage({ searchParams }) {
    const session = await auth();
    
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || '';
    
    // Fetch all users if no query, else search
    let matchedUsers = query ? await searchUsers(query) : await getUsers();

    // Filter out the active user
    if (session?.user?.email) {
        matchedUsers = matchedUsers.filter(user => user.email !== session.user.email);
    }

    return (
        <div className="flex flex-col min-h-full items-center py-6 lg:py-12 w-full relative px-4 text-slate-900">
             <h1 className="hidden lg:block text-4xl font-black text-zinc-900 mb-8 font-serif drop-shadow-md">
                 Explore
             </h1>
             
             <SearchInput className />

             <div className="w-full max-w-xl flex flex-col gap-4 mt-6 relative z-10">
                 {!query && matchedUsers.length > 0 && (
                     <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">Discover New People</h2>
                 )}
                 {query && matchedUsers.length === 0 && (
                     <div className="text-center text-slate-500 mt-12 text-lg italic">No users found for &quot;{query}&quot;</div>
                 )}
                 
                 {/* Results List */}
                 {matchedUsers.map(user => (
                     <Link href={user.username ? `/dashboard/profile/${user.username}` : '#'} key={user.id} className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 hover:border-zinc-400 transition-all cursor-pointer shadow-sm">
                          <div className="relative h-14 w-14 rounded-full bg-zinc-200 overflow-hidden shrink-0 border border-slate-200">
                              {user.profile_picture && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                              )}
                          </div>
                          <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="font-semibold text-lg text-slate-900 truncate group-hover:text-zinc-600 transition-colors">
                                  {user.username || 'Unknown'}
                              </span>
                              <span className="text-sm text-slate-500 truncate">{user.name || user.email}</span>
                          </div>
                          <div>
                              <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-sm active:scale-95">
                                  Profile
                              </button>
                          </div>
                     </Link>
                 ))}
             </div>
        </div>
    )
}
