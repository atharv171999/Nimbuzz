import { searchUsers } from '@/app/lib/db';
import SearchInput from './SearchInput';
import Link from 'next/link';
import { auth } from '@/auth';

export default async function SearchPage({ searchParams }) {
    const session = await auth();
    
    // Next.js 15+ passes searchParams as a Promise to server components!
    const resolvedParams = await searchParams;
    const query = resolvedParams?.q || '';
    
    // Fetch users only if a query was constructed
    let matchedUsers = query ? await searchUsers(query) : [];

    // Filter out the active user so they don't see themselves in search results
    if (session?.user?.email) {
        matchedUsers = matchedUsers.filter(user => user.email !== session.user.email);
    }

    return (
        <div className="flex flex-col min-h-full items-center py-6 lg:py-12 w-full relative px-4 text-slate-900">
             {/* Title - Hidden on mobile as we have the global header */}
             <h1 className="hidden lg:block text-4xl font-black text-zinc-900 mb-8 font-serif drop-shadow-md">
                 Explore
             </h1>
             
             <SearchInput />

             <div className="w-full max-w-xl flex flex-col gap-4 mt-6 relative z-10">
                 {query && matchedUsers.length === 0 && (
                     <div className="text-center text-slate-500 mt-12 text-lg">No users found for "{query}"</div>
                 )}
                 {!query && (
                     <div className="text-center text-slate-500 mt-12 flex flex-col items-center">
                         <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-slate-300"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                         </div>
                         Start typing a username to discover people.
                     </div>
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
