import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Nimbuzz | Connect with the world",
    template: "%s | Nimbuzz"
  },
  description: "Experience the next generation of social interaction with Nimbuzz. Connect, share, and gather with your community in a beautifully crafted, privacy-first platform.",
  keywords: ["Nimbuzz", "Social Media", "Community", "Connection", "Gather", "Social Network"],
  icons: {
    icon: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-zinc-50 transition-colors font-sans"
      >
        {children}
      </body>
    </html>
  );
}
