import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_ID,
      clientSecret: process.env.SPOTIFY_SECRET,
      authorization: {
        params: {
          scope: 'user-read-email playlist-modify-public'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  cookies: {
    sessionToken: {
      name:   '__Host-next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'none',
        secure: process.env.NODE_ENV === 'production',
        path: '/'
      }
    }
  }
})
