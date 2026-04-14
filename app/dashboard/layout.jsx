import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
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
                <div className="flex flex-col lg:flex-row h-screen w-full bg-slate-50 text-slate-900 overflow-hidden relative">
                    {/* Subtle monochromatic background */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white z-0"></div>

                    {/* Desktop Sidebar nav on the left */}
                    <Sidebar user={dbUser} />

                    <div className="flex-1 flex flex-col min-h-0 relative z-10">
                        {/* Mobile Top Header */}
                        <MobileHeader />

                        {/* Main content area */}
                        <main className="flex-1 overflow-y-auto w-full relative pb-20 lg:pb-0">
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
