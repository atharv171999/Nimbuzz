'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { createPostAction } from '@/app/actions/post';

export default function CreatePostModal({ isOpen, onClose, user }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [state, formAction, isPending] = useActionState(createPostAction, null);
    
    // For handling drag events explicitly
    const fileInputRef = useRef(null);
    
    // Reset modal state when it opens/closes or when explicitly successfully saved
    useEffect(() => {
        if (!isOpen) {
            // clear out the wizard once completely closed
            setTimeout(() => {
                setPreviewImage(null);
                setCaption('');
            }, 300);
        }
    }, [isOpen]);

    useEffect(() => {
        if (state?.success) {
            // Post was created!
            onClose();
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>
            
            {/* Modal Container */}
            <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-900">Create new post</h2>
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-full hover:bg-slate-100"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form action={formAction} className="flex flex-col md:flex-row h-[60vh] max-h-[600px] min-h-[400px]">
                    
                    {/* Left Pane: Image Uploader / Preview */}
                    <div className="flex-1 border-r border-slate-200 bg-slate-50 flex flex-col items-center justify-center relative group">
                        {previewImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center px-6">
                                <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-4 border-2 border-slate-300 rounded-xl p-3" />
                                <h3 className="text-xl font-medium text-slate-800 mb-2">Drag photos here</h3>
                                <p className="text-slate-500 text-sm mb-6">Or simply click to browse your files.</p>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-white text-sm font-medium transition-colors">
                                    Select from computer
                                </button>
                            </div>
                        )}
                        
                        {/* The actual hidden input */}
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            name="image" 
                            id="image" 
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        {/* Overlay visible to change image if one already selected */}
                        {previewImage && (
                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-md text-slate-800 text-xs font-semibold border border-slate-300 shadow-xl">
                                    Change photo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Pane: Details & Metadata */}
                    <div className="w-full md:w-80 flex flex-col bg-white">
                        <div className="flex-1 p-4 flex flex-col">
                            {/* Profile Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 shrink-0 relative border border-slate-200">
                                    {user?.profile_picture && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-slate-800">
                                    {user?.username || user?.name || user?.email?.split('@')[0] || 'Write a caption'}
                                </span>
                            </div>

                            <textarea 
                                name="caption"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="Write a caption..."
                                className="w-full flex-1 bg-transparent border-0 resize-none text-slate-800 focus:ring-0 placeholder:text-slate-400 text-sm"
                                maxLength={2200}
                            />
                            
                            <div className="text-xs text-slate-500 text-right font-mono">
                                {caption.length} / 2,200
                            </div>

                            {/* Error Banner */}
                            {state?.error && (
                                <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs text-center border-dashed">
                                    {state.error}
                                </div>
                            )}
                        </div>

                        {/* Footer / Submit */}
                        <div className="p-4 border-t border-slate-200">
                            <button 
                                type="submit" 
                                disabled={isPending || (!previewImage && !caption.trim())}
                                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2Icon className="w-4 h-4" />
                                        <span>Sharing...</span>
                                    </>
                                ) : (
                                    <span>Share</span>
                                )}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}

// Inline SVGs to avoid requiring the lucide-react dependency

const XIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const ImageIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
        <circle cx="9" cy="9" r="2"></circle>
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
    </svg>
);

const Loader2Icon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
);
