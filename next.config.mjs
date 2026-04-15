/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore ESLint errors during the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript errors during the build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure that external images are supported if you use next/image later
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
