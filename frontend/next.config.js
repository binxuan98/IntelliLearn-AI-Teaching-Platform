/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL || 'http://localhost:3002/api/:path*',
      },
    ]
  },
  // 允许外部访问
  experimental: {
    allowMiddlewareResponseBody: true,
  },
}

module.exports = nextConfig