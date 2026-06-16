/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't let lint warnings block the Vercel deploy.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
