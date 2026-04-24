'use client';

import { useActionState } from 'react';
import { changePasswordAction } from '@/app/actions/security';

export default function SecurityForm() {
    const [state, formAction, isPending] = useActionState(changePasswordAction, { error: null, success: null });

    return (
        <form action={formAction} className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Change Password</h3>
                        <p className="text-xs text-slate-500 font-medium mt-1">Update your account password to stay secure.</p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="max-w-md space-y-4">
                        <div>
                            <label htmlFor="currentPassword" title="Enter your current password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Current Password</label>
                            <input 
                                type="password" 
                                id="currentPassword"
                                name="currentPassword"
                                required
                                placeholder="••••••••"
                                className="block w-full rounded-xl border-0 bg-slate-50 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div>
                                <label htmlFor="newPassword" title="Enter a new password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                                <input 
                                    type="password" 
                                    id="newPassword"
                                    name="newPassword"
                                    required
                                    placeholder="••••••••"
                                    className="block w-full rounded-xl border-0 bg-slate-50 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" title="Confirm your new password" className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                            <input 
                                type="password" 
                                id="confirmPassword"
                                name="confirmPassword"
                                required
                                placeholder="••••••••"
                                className="block w-full rounded-xl border-0 bg-slate-50 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex-1 mr-4">
                        {state?.error && (
                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                <span className="text-xs font-bold italic tracking-tight">{state.error}</span>
                            </div>
                        )}
                        {state?.success && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span className="text-xs font-bold italic tracking-tight">{state.success}</span>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isPending}
                        className="rounded-xl bg-zinc-950 px-8 py-3 text-sm font-bold text-white shadow-xl hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:opacity-50 active:scale-[0.98] transition-all"
                    >
                        {isPending ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>

            {/* Additional Security Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password Requirements</h4>
                    <ul className="text-xs text-slate-600 space-y-2 font-medium">
                        <li className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-300 rounded-full" />
                            Minimum 6 characters long
                        </li>
                    </ul>
                </div>
            </div>
        </form>
    );
}
