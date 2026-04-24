import { searchUsers, getUsers } from '@/app/lib/db';
import SearchInput from './SearchInput';
import Link from 'next/link';
import Image from 'next/image';
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
        <div className="flex flex-col min-h-full items-center py-6 lg:py-16 w-full relative px-6 bg-zinc-50 transition-colors duration-500">
             <h1 className="hidden lg:block text-6xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 mb-12 tracking-tighter">
                 Explore
             </h1>
             
             <SearchInput className="shadow-xl shadow-zinc-200/50" />

             <div className="w-full max-w-xl flex flex-col gap-5 mt-8 relative z-10">
                 {!query && matchedUsers.length > 0 && (
                     <h2 className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mb-4 px-4">Discover New People</h2>
                 )}
                 {query && matchedUsers.length === 0 && (
                     <div className="text-center text-zinc-500 mt-12 text-lg italic">No users found for &quot;{query}&quot;</div>
                 )}
                 
                  {/* Results List */}
                  {matchedUsers.map(user => (
                      <Link href={user.username ? `/dashboard/profile/${user.username}` : '#'} key={user.id} className="group flex items-center gap-6 bg-white border border-zinc-200/50 rounded-[2.5rem] p-6 hover:border-primary transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5">
                           <div className="relative h-20 w-20 rounded-full bg-zinc-100 overflow-hidden shrink-0 border-4 border-white transition-all group-hover:scale-105 duration-500 shadow-md">
                                {user.profile_picture ? (
                                    <Image 
                                        src={user.profile_picture} 
                                        alt="Profile" 
                                        fill
                                        className=" w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-50" />
                                )}
                           </div>
                           <div className="flex flex-col flex-1 overflow-hidden ml-2">
                                <span className="font-black text-2xl text-zinc-900 tracking-tighter truncate group-hover:text-primary transition-colors">
                                    {user.name || 'Citizen'}
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest text-zinc-400 truncate">@{user.username || 'unknown'}</span>
                           </div>
                           <div className="hidden sm:block">
                               <div className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 text-center">
                                   Profile
                               </div>
                           </div>
                      </Link>
                  ))}
             </div>
        </div>
    )
}
