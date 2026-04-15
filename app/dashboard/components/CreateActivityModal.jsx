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
            <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Create a Community Ping</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100 italic">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
                            <input 
                                required
                                name="title"
                                placeholder="e.g., Weekend Badminton Match"
                                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                                <select 
                                    name="category"
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all font-medium appearance-none"
                                >
                                    <option>Sports</option>
                                    <option>Coffee</option>
                                    <option>Tech</option>
                                    <option>Music</option>
                                    <option>Exploration</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Max Participants</label>
                                <input 
                                    required
                                    type="number"
                                    name="max_participants"
                                    defaultValue="4"
                                    min="2"
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">City / Area</label>
                                <input 
                                    required
                                    name="city_or_area"
                                    placeholder="e.g., Downtown"
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Exact Location</label>
                                <input 
                                    required
                                    name="location_name"
                                    placeholder="e.g., Central Park Courts"
                                    className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Event Time</label>
                            <input 
                                required
                                type="datetime-local"
                                name="event_time"
                                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                            <textarea 
                                required
                                name="description"
                                rows="3"
                                placeholder="Tell us more! Level of skill, what to bring, etc."
                                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-zinc-900 transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-zinc-950 text-white font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? 'Posting Ping...' : 'Post Community Ping'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
