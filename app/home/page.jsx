import { auth } from '@/auth';
// import { SignOutButton } from '@/app/components/SignOutButton';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="relative min-h-screen border-r border-zinc-200 overflow-hidden bg-zinc-950 selection:bg-zinc-700">
      {/* Background gradients and blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[50%] rounded-full bg-zinc-800/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[60%] w-[40%] rounded-full bg-zinc-800/30 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] h-[50%] w-[60%] rounded-full bg-zinc-800/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navigation Bar */}
      {/* <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Nimbus</span>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-300 transition hover:text-white">
                  Dashboard
                </Link>
                <SignOutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-sm font-medium text-gray-300 transition hover:text-white">
                  Sign in
                </Link>
                <Link href="/signup" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav> */}

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">

          {/* Welcome Badge for Authenticated Users */}
          {/* {session?.user && (
            <div className="mx-auto mb-8 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <p className="text-sm font-medium text-gray-300">
                Welcome back, {session.user.name?.split(' ')[0] || 'User'}
              </p>
            </div>
          )} */}

          <div className="mx-auto flex flex-col items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 shadow-lg shadow-black/20 mb-3">
              <svg className="h-8 w-8 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Nimbus</span>
          </div>

          <h1 className="bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-2xl md:text-3xl font-black tracking-tighter text-transparent lg:text-5xl">
            The next generation of social interaction.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl  text-sm md:text-lg leading-8 text-gray-400">
            Join millions of users sharing their lives, ideas, and passions. Experience a beautifully crafted, privacy-first social platform designed for the modern web.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">

          </div>
        </div>

        {/* Floating Feature Cards (Visual Flair) */}
        {/* {!session?.user && (
          <div className="mx-auto mt-24 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: 'Lightning Fast', desc: 'Built on Next.js 16 and Turbopack for unparalleled performance.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Bank-grade Security', desc: 'Your data is protected by Supabase Row Level Security.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              ].map((feature, i) => (
                <div key={i} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:bg-white/10">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                    <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}
