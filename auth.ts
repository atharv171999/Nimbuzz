import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { getUser } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await getUser(credentials.email as string);
                if (!user || (!user.password && user.password !== '')) return null;

                const passwordsMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (passwordsMatch) return user;

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
