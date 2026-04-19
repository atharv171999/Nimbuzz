'use client';

import { useActionState, useState, useEffect } from 'react';
import { updateUserProfileAction } from '@/app/actions/profile';
import { checkUsernameAvailability, checkEmailAvailability } from '@/app/actions/user';

export default function ProfileForm({ user }) {
    const [state, formAction, isPending] = useActionState(updateUserProfileAction, { error: null, success: null });
    const [previewImage, setPreviewImage] = useState(user.profile_picture || null);

    // Live status states: null | 'checking' | 'available' | 'taken'
    const [usernameStatus, setUsernameStatus] = useState(null);
    const [emailStatus, setEmailStatus] = useState(null);
    const [username, setUsername] = useState(user.username || "");
    const [email, setEmail] = useState(user.email || "");

    // Debounced Username Check
    useEffect(() => {
        if (!username.trim() || username === (user.username || "")) {
            setUsernameStatus(null);
            return;
        }

        setUsernameStatus("checking");

        const timer = setTimeout(async () => {
            try {
                // Pass current email to exclude self from check
                const { available } = await checkUsernameAvailability(username, user.email);
                setUsernameStatus(available ? "available" : "taken");
            } catch (e) {
                setUsernameStatus(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [username, user.username, user.email]);

    // Debounced Email Check
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email) || email === user.email) {
            setEmailStatus(null);
            return;
        }

        setEmailStatus("checking");

        const timer = setTimeout(async () => {
            try {
                // Pass current email to exclude self from check
                const { available } = await checkEmailAvailability(email, user.email);
                setEmailStatus(available ? "available" : "taken");
            } catch (e) {
                setEmailStatus(null);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [email, user.email]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
    };

    const StatusMessage = ({ status }) => {
        if (!status) return null;
        if (status === "checking") return <span className="text-[10px] text-zinc-500 animate-pulse ml-2 font-bold uppercase tracking-widest">Checking...</span>;
        if (status === "available") return (
            <span className="text-[10px] text-emerald-600 ml-2 font-bold uppercase tracking-widest flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Available
            </span>
        );
        if (status === "taken") return (
            <span className="text-[10px] text-red-500 ml-2 font-bold uppercase tracking-widest flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Already taken
            </span>
        );
        return null;
    };

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Editable Profile Fields */}
                <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-1">Name</label>
                    <input 
                        type="text" 
                        id="name"
                        name="name"
                        defaultValue={user.name || ''} 
                        className="block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium"
                    />
                </div>
                
                <div>
                    <label htmlFor="username" className="flex items-baseline text-sm font-bold text-slate-900 mb-1">
                        Username
                        <StatusMessage status={usernameStatus} />
                    </label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset transition-all font-medium sm:text-sm sm:leading-6 placeholder:text-zinc-400 ${
                            usernameStatus === 'taken' ? 'ring-red-500 focus:ring-red-500' : 
                            usernameStatus === 'available' ? 'ring-emerald-500 focus:ring-emerald-500' : 'ring-zinc-200 focus:ring-zinc-900'
                        }`}
                    />
                </div>

                <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-bold text-slate-900 mb-1">Date of Birth</label>
                    <input 
                        type="date" 
                        id="date_of_birth"
                        name="date_of_birth"
                        defaultValue={user.date_of_birth || ''} 
                        className="block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="flex items-baseline text-sm font-bold text-slate-900 mb-1">
                        Email
                        <StatusMessage status={emailStatus} />
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset transition-all font-medium sm:text-sm sm:leading-6 placeholder:text-zinc-400 ${
                            emailStatus === 'taken' ? 'ring-red-500 focus:ring-red-500' : 
                            emailStatus === 'available' ? 'ring-emerald-500 focus:ring-emerald-500' : 'ring-zinc-200 focus:ring-zinc-900'
                        }`}
                    />
                    <p className="mt-1 text-xs text-zinc-500">Changing your email may require you to log in again.</p>
                </div>

                {/* Section Divider */}
                <div className="md:col-span-2 pt-4 border-t border-zinc-100 mt-2">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Edit Profile Details</h3>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-1">Profile Picture</label>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-zinc-200 relative bg-zinc-100 shrink-0">
                            {previewImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-300" />
                            )}
                        </div>
                        <div className="relative">
                            <input 
                                type="file" 
                                name="profile_picture" 
                                id="profile_picture" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-zinc-50 transition-colors pointer-events-none">
                                Choose new photo
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-bold text-slate-900 mb-1">Bio</label>
                    <textarea 
                        name="bio" 
                        id="bio"
                        rows={4}
                        defaultValue={user.bio || ''}
                        placeholder="Tell us a little bit about yourself..."
                        className="block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all resize-none font-medium"
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-bold text-slate-900 mb-1">Gender</label>
                    <div className="relative">
                        <select 
                            name="gender" 
                            id="gender"
                            defaultValue={user.gender || ''} 
                            className="block w-full appearance-none rounded-xl border-0 bg-zinc-50 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 transition-all font-medium"
                        >
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                            <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex-1 mr-4">
                     {state?.error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                            {state.error}
                        </div>
                     )}
                     {state?.success && (
                        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-600 font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                            {state.success}
                        </div>
                     )}
                </div>
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
