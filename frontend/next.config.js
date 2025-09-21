// Next.js config: proxy /api/* to your backend to avoid CORS/network blockers
// Uses NEXT_PUBLIC_API_BASE if set; otherwise defaults to http://127.0.0.1:8000

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
