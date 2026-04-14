import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-hidden selection:bg-zinc-700">
      
      {/* Soft Background Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-zinc-900/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-zinc-900/50 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500 mb-6">
            <svg className="h-10 w-10 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white sm:text-5xl">
            Nimbus
          </h1>
          <p className="mt-4 text-zinc-400 text-lg sm:text-xl font-medium max-w-xs">
            Connect with the world at the speed of thought.
          </p>
        </div>

        {/* Global Action Hub */}
        <div className="w-full flex flex-col gap-4">
          {session?.user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center w-full px-8 py-4 rounded-2xl bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/signup" 
                className="flex items-center justify-center w-full px-8 py-4 rounded-2xl bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
              >
                Create Account
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center w-full px-8 py-4 rounded-2xl bg-zinc-900 border border-white/10 text-white font-bold text-lg hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Bottom Metadata */}
        <div className="mt-12 opacity-40 text-xs font-bold tracking-[0.2em] text-white uppercase pointer-events-none">
          Next Gen Social Platform
        </div>
      </main>
    </div>
  );
}
