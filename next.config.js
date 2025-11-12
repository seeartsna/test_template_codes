/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // nodeMiddleware: true
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;