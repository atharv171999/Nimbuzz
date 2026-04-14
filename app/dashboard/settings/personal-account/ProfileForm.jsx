'use client';

import { useActionState, useState } from 'react';
import { updateUserProfileAction } from '@/app/actions/profile';

export default function ProfileForm({ user }) {
    const [state, formAction, isPending] = useActionState(updateUserProfileAction, { error: null, success: null });
    const [previewImage, setPreviewImage] = useState(user.profile_picture || null);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
        }
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
                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 transition-all"
                    />
                </div>
                
                <div>
                    <label htmlFor="username" className="block text-sm font-bold text-slate-900 mb-1">Username</label>
                    <input 
                        type="text" 
                        id="username"
                        name="username"
                        defaultValue={user.username || ''} 
                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="date_of_birth" className="block text-sm font-bold text-slate-900 mb-1">Date of Birth</label>
                    <input 
                        type="date" 
                        id="date_of_birth"
                        name="date_of_birth"
                        defaultValue={user.date_of_birth || ''} 
                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 transition-all"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        defaultValue={user.email || ''} 
                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 transition-all"
                    />
                    <p className="mt-1 text-xs text-gray-500">Changing your email may require you to log in again.</p>
                </div>

                {/* Editable Profile Fields */}
                <div className="md:col-span-2 pt-4 border-t border-slate-200 mt-2">
                    <h3 className="text-xl font-semibold text-slate-900 mb-4">Edit Profile</h3>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-900 mb-1">Profile Picture</label>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="h-16 w-16 rounded-full overflow-hidden border border-slate-200 relative bg-slate-50 shrink-0">
                            {previewImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-fuchsia-600 opacity-50" />
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
                            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 transition-colors pointer-events-none">
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
                        className="block w-full rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 placeholder:text-gray-400 transition-all resize-none"
                    />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-bold text-slate-900 mb-1">Gender</label>
                    <div className="relative">
                        <select 
                            name="gender" 
                            id="gender"
                            defaultValue={user.gender || ''} 
                            className="block w-full appearance-none rounded-xl border-0 bg-white py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 backdrop-blur-sm transition-all"
                        >
                            <option value="" disabled hidden>Select Gender</option>
                            <option value="Male" className="bg-white text-slate-900">Male</option>
                            <option value="Female" className="bg-white text-slate-900">Female</option>
                            <option value="Non-binary" className="bg-white text-slate-900">Non-binary</option>
                            <option value="Prefer not to say" className="bg-white text-slate-900">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                     {state?.error && <span className="text-sm text-red-400">{state.error}</span>}
                     {state?.success && <span className="text-sm text-emerald-400">{state.success}</span>}
                </div>
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 disabled:opacity-70 transition-all"
                >
                    {isPending ? 'Saving...' : 'Save Profile'}
                </button>
            </div>
        </form>
    );
}
