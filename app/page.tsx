import { auth } from '@/auth';
import { SignOutButton } from '@/app/components/SignOutButton';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-12 text-center shadow-2xl">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900">
          NextAuth Demo
        </h1>

        {session?.user ? (
          <div className="space-y-6">
            <div className="mx-auto max-w-md rounded-xl border border-blue-200 bg-blue-50 p-6 text-left shadow-sm">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-500">
                Authenticated User
              </p>
              <p className="mb-1 text-xl font-medium text-blue-900">
                {session.user.name || session.user.email}
              </p>
              <p className="rounded-lg bg-blue-100/50 p-2 font-mono text-sm text-blue-700">
                Email: {session.user.email}
              </p>
            </div>

            <SignOutButton />
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-lg text-gray-600">
              You are currently not logged in.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-green-600 px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
