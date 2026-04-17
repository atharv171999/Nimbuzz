import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import { auth } from '@/auth';
import { getUser } from '@/app/lib/db';

export default async function DashboardLayout({

    children,
}) {
    const session = await auth();
    let dbUser = null;
    if (session?.user?.email) {
        dbUser = await getUser(session.user.email);
    }

    return (
        <>
            {session?.user && (
                <div className="flex flex-col lg:flex-row h-screen w-full bg-zinc-50 text-zinc-900 overflow-hidden relative transition-colors duration-500">
                    {/* Extra Soft Purple background gradient */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0"></div>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent z-0 opacity-50"></div>

                    {/* Desktop Sidebar nav on the left */}
                    <Sidebar user={dbUser} />

                    <div className="flex-1 flex flex-col min-h-0 relative z-10">
                        {/* Mobile Top Header */}
                        {/* <MobileHeader /> */}

                        {/* Main content area - crisp white on zinc background */}
                        <main 
                            className="flex-1 overflow-y-auto w-full relative pb-20 lg:pb-0 no-scrollbar bg-white shadow-sm border-x border-zinc-200/50"
                        >
                            {children}
                        </main>

                        {/* Mobile Bottom Nav */}
                        <BottomNav user={dbUser} />
                    </div>
                </div>
            )}
        </>
    );
}
