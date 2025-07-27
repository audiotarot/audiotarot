import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'user-read-email playlist-modify-public',
        },
      },
      callbackUrl: process.env.SPOTIFY_REDIRECT_URI,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = { id: token.id };
      return session;
    },
  },
  pages: {
    signIn: '/api/auth/signin', // Default sign-in route
  },
  cookies: {
    sessionToken: {
      name: '__Host-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax', // Safe for production
        secure: true, // Enforce HTTPS on Vercel
        path: '/',
      },
    },
  },
});