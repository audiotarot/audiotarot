// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export default NextAuth({
  // ensures NEXTAUTH_SECRET is used (you already set this in Vercel)
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "user-read-email playlist-modify-public",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
})
