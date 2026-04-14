import Sidebar from './components/Sidebar';
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
                <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden relative">
                    {/* Subtle monochromatic background */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-white z-0"></div>

                    {/* Sidebar nav on the left */}
                    <div className="relative z-10 flex h-full w-full">
                        <Sidebar user={dbUser} />

                        {/* Main content area */}
                        <main className="flex-1 overflow-y-auto w-full relative">
                            {children}
                        </main>
                    </div>
                </div>
            )}
        </>
    );
}
