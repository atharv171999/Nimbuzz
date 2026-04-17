'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { sendChatMessage, fetchMessages } from '@/app/actions/chat';

export default function ChatUI({ initialMessages, myEmail, targetUser }) {
    const [messages, setMessages] = useState(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const scrollContainerRef = useRef(null);

    // Auto-scroll natively to stop parent propagation
    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Polling effect: Check for new messages every 3 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await fetchMessages(targetUser.email);
            if (res.success && res.messages) {
                // Only update if lengths differ or content differs to avoid unnecessary re-renders
                // Simpler check: if length differs.
                if (res.messages.length > messages.length) {
                    setMessages(res.messages);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [targetUser.email, messages.length]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputText.trim() || isSending) return;

        const optimisticMessage = {
            id: Date.now().toString(),
            sender_email: myEmail,
            receiver_email: targetUser.email,
            content: inputText.trim(),
            created_at: new Date().toISOString()
        };

        setIsSending(true);
        setMessages(prev => [...prev, optimisticMessage]);
        setInputText('');

        const res = await sendChatMessage(targetUser.email, optimisticMessage.content);
        if (!res.success) {
            // Revert on failure
            alert(res.error || "Message failed to send");
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
        setIsSending(false);
    };

    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 relative transition-colors duration-500">
            {/* Thread Header */}
            <div className="px-8 py-6 flex items-center justify-between bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl sticky top-0 z-10 transition-all duration-300 border-b border-zinc-200/50 dark:border-zinc-800/50">
                <Link href={`/dashboard/profile/${targetUser.username}`} className="flex items-center gap-5 group px-4 py-2 rounded-2xl hover:bg-white/50 dark:hover:bg-zinc-800/50 transition-all">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-100 dark:border-zinc-800 shrink-0 bg-zinc-50 dark:bg-zinc-900 group-hover:border-primary group-hover:scale-105 transition-all duration-500">
                        {targetUser.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={targetUser.profile_picture} alt={targetUser.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-[family-name:var(--font-outfit)] font-black text-2xl text-zinc-900 dark:text-white tracking-tighter group-hover:text-primary transition-colors">
                            {targetUser.name || targetUser.username || targetUser.email.split('@')[0]}
                        </h2>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 dark:text-zinc-500">
                            @{targetUser.username || targetUser.email.split('@')[0]}
                        </p>
                    </div>
                </Link>
                
                <Link 
                    href={`/dashboard/profile/${targetUser.username || targetUser.name || targetUser.email.split('@')[0]}`}
                    className="px-6 py-3 text-xs font-black uppercase tracking-widest text-primary bg-primary/5 hover:bg-primary hover:text-white rounded-full transition-all duration-300 shadow-sm"
                >
                    Profile
                </Link>
            </div>

            {/* Messages Scroll Area */}
            <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3 custom-scrollbar"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
                        No messages yet. Send a hi!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_email === myEmail;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div 
                                    className={`
                                        max-w-[75%] px-6 py-4 rounded-[1.75rem] text-[15px] leading-relaxed shadow-sm
                                        ${isMe 
                                            ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/10' 
                                            : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200/50 dark:border-zinc-800/50 rounded-bl-none'
                                        }
                                    `}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Floating Input Footer Form */}
            <div className="p-6 pointer-events-none">
                <form 
                    onSubmit={handleSend}
                    className="pointer-events-auto flex items-center gap-4 max-w-2xl mx-auto border border-white/60 dark:border-zinc-800/60 rounded-[2rem] pl-6 pr-2 py-2 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]"
                >
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type something..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-zinc-900 dark:text-white text-[15px] placeholder:text-zinc-400 py-2.5 font-bold tracking-tight"
                    />
                    <button 
                        type="submit"
                        disabled={!inputText.trim() || isSending}
                        className="text-white bg-primary font-black uppercase tracking-widest px-8 rounded-full py-3 text-xs disabled:opacity-50 transition-all hover:bg-primary-hover shadow-lg shadow-primary/10"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
