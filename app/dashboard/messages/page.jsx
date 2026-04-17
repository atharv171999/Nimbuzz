export default function MessagesDefaultPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full w-full bg-white">
            <div className="w-24 h-24 rounded-full border-[3px] border-primary flex items-center justify-center mb-6 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary relative -right-1">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Messages</h2>
            <p className="text-slate-500 text-[15px] max-w-sm mb-6">Send private photos and messages to a friend.</p>
            <button className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all">
                Send Message
            </button>
        </div>
    );
}
