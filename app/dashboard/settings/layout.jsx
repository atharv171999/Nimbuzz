"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsLayout({ children }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Personal Account", href: "/dashboard/settings/personal-account" },
        { name: "Security", href: "/dashboard/settings/security" },
    ];

    return (
        <div className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-8 pb-32">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">Settings</h1>
            
            {/* Horizontal Tabs */}
            <div className="border-b border-slate-200 mb-8 overflow-x-auto custom-scrollbar">
                <nav className="-mb-px flex space-x-8 min-w-max" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                                    ${isActive 
                                        ? 'border-zinc-900 text-zinc-900' 
                                        : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                                    }
                                `}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Inner Route Content */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
