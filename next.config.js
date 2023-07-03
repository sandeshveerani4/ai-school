/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/file_uploads/:path*",
        destination: "https://labs.barathkumaar.com/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
