import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from './mongodb';
import { compare } from 'bcryptjs';

// Check if we're in build phase
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // During build time, skip actual authentication
        if (isBuildTime) {
          console.log('Build time - skipping MongoDB authentication');
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const client = await clientPromise;
          const db = client.db();
          const user = await db.collection('users').findOne({ email: credentials.email });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await compare(credentials.password, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            name: user.name || user.username
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-build-time',
}; 