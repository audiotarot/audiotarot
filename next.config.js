/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // You can add other Next.js config options here if needed
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
