import { auth } from '@/auth';
import Link from 'next/link';

export const metadata = {
  title: "Home",
  description: "Nimbuzz - The next generation of social interaction. Join millions sharing their lives and passions.",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-50 overflow-hidden selection:bg-primary/10">
      
      {/* Soft Background Blobs - Light Aesthetic */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <main className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
        
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-primary shadow-[0_15px_40px_rgba(147,51,234,0.2)] group-hover:scale-105 transition-transform duration-500 mb-8 border-4 border-white">
            <svg className="h-12 w-12 text-white fill-current" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          </div>
          <h1 className="text-5xl font-[family-name:var(--font-outfit)] font-black tracking-tighter text-zinc-900 sm:text-7xl">
            Nimbuzz
          </h1>
          <p className="mt-4 text-zinc-500 text-lg sm:text-xl font-bold max-w-xs leading-tight">
            Connect with the world.
          </p>
        </div>

        {/* Global Action Hub */}
        <div className="w-full flex flex-col gap-4">
          {session?.user ? (
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center w-full px-8 py-5 rounded-[2rem] bg-primary text-white font-black text-xl hover:bg-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(147,51,234,0.3)]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/signup" 
                className="flex items-center justify-center w-full px-8 py-5 rounded-[2rem] bg-primary text-white font-black text-xl hover:bg-primary-hover transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_rgba(147,51,234,0.3)]"
              >
                Create Account
              </Link>
              <Link 
                href="/login" 
                className="flex items-center justify-center w-full px-8 py-5 rounded-[2rem] bg-white border border-zinc-200 text-zinc-900 font-bold text-lg hover:bg-zinc-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              >
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Bottom Metadata */}
        <div className="mt-12 opacity-30 text-xs font-bold tracking-[0.2em] text-zinc-900 uppercase pointer-events-none">
          Next Gen Social Platform
        </div>
      </main>
    </div>
  );
}
