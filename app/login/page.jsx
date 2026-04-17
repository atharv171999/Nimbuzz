'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(login, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
            {/* Soft Purple background gradient - GoTripBooking style */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10 transition-all duration-500">
                <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 p-8 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.1)] backdrop-blur-xl sm:p-12">
                    <div className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-500">
                            <svg className="h-8 w-8 text-white fill-current" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                        </div>
                        <h2 className="mt-8 text-4xl font-[family-name:var(--font-outfit)] font-black tracking-tighter text-zinc-900 dark:text-white leading-none">
                            Welcome back
                        </h2>
                        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
                            Please sign in to Nimbuzz
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" action={formAction}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-2xl border border-zinc-200/50 bg-white py-4 px-6 text-zinc-900 shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary sm:text-sm placeholder:text-zinc-400 transition-all font-bold tracking-tight"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-bold text-zinc-900 hover:text-zinc-600 underline decoration-zinc-300 hover:decoration-zinc-900 underline-offset-4 transition-all">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-2xl border border-zinc-200/50 bg-white py-4 px-6 text-zinc-900 shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary sm:text-sm placeholder:text-zinc-400 transition-all font-bold tracking-tight"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-2xl bg-primary px-8 py-4.5 text-lg font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? 'Verifying...' : 'Sign in'}
                            </button>
                        </div>

                        <div className="min-h-8">
                            {errorMessage && (
                                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center border border-red-200">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-bold text-zinc-900 hover:text-zinc-600 underline decoration-zinc-300 hover:decoration-zinc-900 underline-offset-4 transition-all">
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
