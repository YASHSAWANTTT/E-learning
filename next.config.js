/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the static export config to allow API routes to work
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Add this to fix the "Extra attributes from the server" warning
  reactStrictMode: true,
  experimental: {
    // This will help with the headers/cookies errors
    serverComponentsExternalPackages: ['next-auth']
  }
};

module.exports = nextConfig;