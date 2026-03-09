'use client';

import { login } from '@/app/actions/auth';
import { useActionState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
    const [errorMessage, formAction, isPending] = useActionState(login, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background blur blobs */}
            <div className="absolute top-0 left-1/4 h-96 w-96 -translate-x-1/2 translate-y-[-20%] rounded-full bg-blue-500/20 blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 h-96 w-96 translate-x-1/2 translate-y-[20%] rounded-full bg-purple-500/20 blur-[120px]"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
                    <div className="text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
                            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-300">
                            Please sign in to your account
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" action={formAction}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-300">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-xl border-0 bg-white/5 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-gray-500 backdrop-blur-sm transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
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
                                        className="block w-full rounded-xl border-0 bg-white/5 py-3 px-4 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 placeholder:text-gray-500 backdrop-blur-sm transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-blue-400 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                            >
                                {isPending ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>

                        <div className="min-h-8">
                            {errorMessage && (
                                <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 text-center border border-red-500/20">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                            Sign up here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
