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
        <div className="flex flex-col h-full bg-white relative">
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white/70 backdrop-blur-md sticky top-0 z-10">
                <Link href={`/dashboard/profile/${targetUser.username}`} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-slate-50 group-hover:ring-2 ring-zinc-900 transition-all">
                        {targetUser.profile_picture ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={targetUser.profile_picture} alt={targetUser.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-zinc-200" />
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-zinc-900 tracking-tight group-hover:text-zinc-600 transition-colors">
                            {targetUser.name || targetUser.username || targetUser.email.split('@')[0]}
                        </h2>
                        <p className="text-xs text-slate-500">
                            @{targetUser.username || targetUser.email.split('@')[0]}
                        </p>
                    </div>
                </Link>
                
                <Link 
                    href={`/dashboard/profile/${targetUser.username || targetUser.name || targetUser.email.split('@')[0]}`}
                    className="px-4 py-1.5 text-sm font-bold text-zinc-700 bg-white border-2 border-zinc-200 hover:border-zinc-900 rounded-full transition-colors shadow-sm"
                >
                    View Profile
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
                                        max-w-[75%] px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                                        ${isMe 
                                            ? 'bg-zinc-900 text-white rounded-br-sm' 
                                            : 'bg-white text-zinc-900 border border-zinc-200/80 rounded-bl-sm shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]'
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

            {/* Input Footer Form */}
            <div className="p-4 bg-white border-t border-slate-200">
                <form 
                    onSubmit={handleSend}
                    className="flex items-center gap-2 max-w-4xl mx-auto border border-slate-200 rounded-full pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-zinc-900 transition-all bg-slate-50"
                >
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Message..."
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-900 text-[15px] placeholder:text-slate-400 py-1.5"
                    />
                    <button 
                        type="submit"
                        disabled={!inputText.trim() || isSending}
                        className="text-white bg-zinc-900 font-bold px-5 rounded-full py-1.5 text-sm disabled:opacity-50 transition-colors hover:bg-zinc-700"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}
