/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'labs.barathkumaar.com',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
