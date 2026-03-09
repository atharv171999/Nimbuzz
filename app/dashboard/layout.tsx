import Sidebar from './components/Sidebar';
import { auth } from '@/auth';



export default async function DashboardLayout({
    
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    return (
        <>
        {session?.user && (
            
            <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white overflow-hidden relative">
            {/* Decorative background blur blobs */}
            <div className="pointer-events-none absolute top-0 right-1/4 h-96 w-96 translate-x-1/2 translate-y-[-20%] rounded-full bg-indigo-500/20 blur-[120px]"></div>
            <div className="pointer-events-none absolute bottom-0 left-1/4 h-96 w-96 -translate-x-1/2 translate-y-[20%] rounded-full bg-pink-500/20 blur-[120px]"></div>

            {/* Sidebar nav on the left */}
            <div className="relative z-10 flex h-full w-full">
                <Sidebar />
                
                {/* Main content area */}
                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                    </main>
                    </div>
                    </div>
                )}
                </>
                );
}
