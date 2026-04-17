'use client';

import { createActivity } from '@/app/actions/society';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateActivityModal({ isOpen, onClose }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.target);
        const result = await createActivity(formData);

        if (result.error) {
            setError(result.error);
            setIsSubmitting(false);
        } else {
            router.refresh();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(147,51,234,0.15)] flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
                <div className="p-7 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <h2 className="text-2xl font-[family-name:var(--font-outfit)] font-black text-zinc-900 dark:text-white tracking-tight">Create a Community Ping</h2>
                    <button onClick={onClose} className="p-2.5 hover:bg-primary/10 text-primary rounded-2xl transition-all">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold rounded-2xl border border-red-100 dark:border-red-900/20 italic">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Title</label>
                            <input 
                                required
                                name="title"
                                placeholder="e.g., Weekend Badminton Match"
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Category</label>
                                <select 
                                    name="category"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all font-bold appearance-none text-zinc-600 dark:text-zinc-300"
                                >
                                    <option>Sports</option>
                                    <option>Coffee</option>
                                    <option>Tech</option>
                                    <option>Music</option>
                                    <option>Exploration</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Max Participants</label>
                                <input 
                                    required
                                    type="number"
                                    name="max_participants"
                                    defaultValue="4"
                                    min="2"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">City / Area</label>
                                <input 
                                    required
                                    name="city_or_area"
                                    placeholder="e.g., Downtown"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Exact Location</label>
                                <input 
                                    required
                                    name="location_name"
                                    placeholder="e.g., Central Park Courts"
                                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Event Time</label>
                            <input 
                                required
                                type="datetime-local"
                                name="event_time"
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3 ml-1">Description</label>
                            <textarea 
                                required
                                name="description"
                                rows="3"
                                placeholder="Tell us more! Level of skill, what to bring, etc."
                                className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-3xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-zinc-800 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-primary text-white font-black uppercase tracking-widest rounded-3xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting Ping...' : 'Post Community Ping'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
