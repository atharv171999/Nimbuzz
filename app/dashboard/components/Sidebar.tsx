"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SignOutButton } from '@/app/components/SignOutButton';


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[72px] xl:w-[244px] h-full flex flex-col justify-between border-r border-white/10 bg-white/5 backdrop-blur-xl text-white transition-all duration-300">
      <div className="flex flex-col pt-8 pb-4">
        {/* Logo area */}
        <div className="flex items-center px-3 xl:px-6 mb-8 h-10 w-full">
          {/* The Instagram text logo would go here in XL, or small logo in mobile, but we will stick to the standard nav spacing */}
          <Link
            href="/dashboard"
            className="hidden xl:block font-bold text-xl drop-shadow-md"
          >
            {/* Can put text logo here */}
          </Link>
        </div>

        <nav className="flex flex-col gap-2 px-3">
          <NavItem
            href="/dashboard"
            label="Home"
            isActive={pathname === "/dashboard"}
            icon={pathname === "/dashboard" ? <HomeIconActive /> : <HomeIcon />}
          />
          <NavItem
            href="/dashboard/messages"
            label="Messages"
            isActive={pathname === "/dashboard/messages"}
            icon={<MessagesIcon />}
          />
          <NavItem
            href="/dashboard/search"
            label="Search"
            isActive={pathname === "/dashboard/search"}
            icon={<SearchIcon />}
          />
          <NavItem
            href="/dashboard/notifications"
            label="Notifications"
            isActive={pathname === "/dashboard/notifications"}
            icon={<NotificationsIcon />}
          />
          <NavItem
            href="/dashboard/profile"
            label="Profile"
            isActive={pathname === "/dashboard/profile"}
            icon={
              <div className="h-6 w-6 rounded-full overflow-hidden border border-white/20 relative">
                {/* Placeholder Profile Image */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-fuchsia-600" />
                <Image
                  src="/avatar-placeholder.png"
                  alt="Profile"
                  width={24}
                  height={24}
                  className="object-cover relative z-10 opacity-50"
                  unoptimized
                />
              </div>
            }
          />
        </nav>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-6">
        <NavItem href="#" label="More" isActive={false} icon={<MoreIcon />} />
        <SignOutButton />
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  isActive,
  icon,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center p-3 rounded-xl transition-all hover:bg-white/10 ${isActive ? "font-bold bg-white/10" : "font-normal text-gray-300 hover:text-white"}`}
      title={label}
    >
      <div
        className={`flex items-center justify-center w-6 h-6 shrink-0 transition-transform group-hover:scale-105 group-active:scale-95 ${isActive ? "text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]" : "text-gray-300 group-hover:text-white"}`}
      >
        {icon}
      </div>
      <span
        className={`hidden xl:block ml-4 text-[15px] leading-5 tracking-wide ${isActive ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-pink-300 drop-shadow-sm" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}

/* SVG Icons matching the provided image */

const HomeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full currentColor"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" />
    <polyline points="9 22 9 12 15 12 15 22" fill="none" />
  </svg>
);

const HomeIconActive = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-full h-full currentColor"
  >
    <path d="M2.5 9.5l9.5-7.5 9.5 7.5v11.5a1 1 0 0 1-1 1h-5.5v-7.5h-6v7.5h-5.5a1 1 0 0 1-1-1v-11.5z" />
  </svg>
);

const ReelsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full currentColor"
  >
    <rect x="3" y="4" width="18" height="16" rx="4" ry="4" />
    <polygon points="10 9 15 12 10 15 10 9" />
  </svg>
);

const MessagesIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full currentColor"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full currentColor"
  >
    <circle cx="10" cy="10" r="7" />
    <line x1="21" y1="21" x2="15" y2="15" />
  </svg>
);


const NotificationsIcon = () => (
  <div className="relative w-full h-full">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-full h-full currentColor"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </div>
);

const MoreIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full currentColor"
  >
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

