/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/embed/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' }
        ]
      },
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'ALLOWALL' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
