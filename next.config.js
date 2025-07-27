module.exports = {
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; connect-src 'self' https://api.spotify.com; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};