"use client";

import { signup } from "@/app/actions/auth";
import { checkUsernameAvailability, checkEmailAvailability } from "@/app/actions/user";
import { useActionState, useState, useEffect } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    signup,
    undefined,
  );

  // Live status states: null | 'checking' | 'available' | 'taken'
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // Debounced Username Check
  useEffect(() => {
    if (!username.trim()) {
      setUsernameStatus(null);
      return;
    }

    setUsernameStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const { available } = await checkUsernameAvailability(username);
        setUsernameStatus(available ? "available" : "taken");
      } catch (e) {
        setUsernameStatus(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Debounced Email Check
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailStatus(null);
      return;
    }

    setEmailStatus("checking");

    const timer = setTimeout(async () => {
      try {
        const { available } = await checkEmailAvailability(email);
        setEmailStatus(available ? "available" : "taken");
      } catch (e) {
        setEmailStatus(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  const StatusMessage = ({ status }) => {
    if (!status) return null;
    if (status === "checking") return <span className="text-[10px] text-zinc-400 animate-pulse ml-2 font-bold uppercase tracking-widest">Checking...</span>;
    if (status === "available") return (
      <span className="text-[10px] text-emerald-500 ml-2 font-bold uppercase tracking-widest flex items-center gap-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Available
      </span>
    );
    if (status === "taken") return (
      <span className="text-[10px] text-red-500 ml-2 font-bold uppercase tracking-widest flex items-center gap-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        Already taken
      </span>
    );
    return null;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-500">
      {/* Soft Purple background gradient - GoTripBooking style */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[60%] w-[60%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-lg my-12 relative z-10 transition-all duration-500">
        <div className="rounded-[2.5rem] border border-zinc-200 bg-white/95 p-8 shadow-[0_20px_60px_-15px_rgba(147,51,234,0.1)] backdrop-blur-xl sm:p-12">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <svg
                className="h-8 w-8 text-white fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h2 className="mt-8 text-4xl font-[family-name:var(--font-outfit)] font-black tracking-tighter text-zinc-900 leading-none">
              Gather with Nimbuzz
            </h2>
            <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
              Join the community project
            </p>
          </div>

          <form className="mt-8 space-y-5" action={formAction}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email-address"
                  className="flex items-baseline text-sm font-bold text-slate-900 mb-1"
                >
                  Email address
                  <StatusMessage status={emailStatus} type="email" />
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium ${
                      emailStatus === 'taken' ? 'ring-red-500 focus:ring-red-500' : 
                      emailStatus === 'available' ? 'ring-emerald-500 focus:ring-emerald-500' : 'ring-zinc-200 focus:ring-zinc-900'
                    }`}
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-slate-900 mb-1"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center">
                  Date of birth
                  <svg
                    className="ml-1.5 h-4 w-4 text-slate-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </label>
                <div className="grid grid-cols-3 gap-3 mt-1">
                  <div className="relative">
                    <select
                      name="dobDay"
                      defaultValue=""
                      className="block w-full appearance-none rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 transition-all font-medium"
                    >
                      <option value="" disabled hidden>
                        Day
                      </option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <option
                            key={day}
                            value={day}
                            className="bg-white text-slate-900"
                          >
                            {day}
                          </option>
                        ),
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      name="dobMonth"
                      defaultValue=""
                      className="block w-full appearance-none rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 transition-all font-medium"
                    >
                      <option value="" disabled hidden>
                        Month
                      </option>
                      {[
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ].map((month, i) => (
                        <option
                          key={month}
                          value={i + 1}
                          className="bg-white text-slate-900"
                        >
                          {month}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      name="dobYear"
                      defaultValue=""
                      className="block w-full appearance-none rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 transition-all font-medium"
                    >
                      <option value="" disabled hidden>
                        Year
                      </option>
                      {Array.from(
                        { length: 100 },
                        (_, i) => new Date().getFullYear() - i,
                      ).map((year) => (
                        <option
                          key={year}
                          value={year}
                          className="bg-white text-slate-900"
                        >
                          {year}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-slate-900 mb-1"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium"
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="username"
                  className="flex items-baseline text-sm font-bold text-slate-900 mb-1"
                >
                  Username
                  <StatusMessage status={usernameStatus} type="username" />
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full lowercase rounded-xl border-0 bg-zinc-50 py-3 px-4 text-zinc-900 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 placeholder:text-zinc-400 transition-all font-medium ${
                      usernameStatus === 'taken' ? 'ring-red-500 focus:ring-red-500' : 
                      usernameStatus === 'available' ? 'ring-emerald-500 focus:ring-emerald-500' : 'ring-zinc-200 focus:ring-zinc-900'
                    }`}
                    placeholder="Username"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full justify-center rounded-2xl bg-primary px-8 py-4.5 text-lg font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isPending ? "Syncing..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-bold text-zinc-900 hover:text-zinc-600 underline decoration-zinc-300 hover:decoration-zinc-900 underline-offset-4 transition-all"
            >
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
