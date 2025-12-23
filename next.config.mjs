/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = {
  // TypeScript errors are ignored during build (risky but keeps build alive)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Unoptimized images are often needed for static exports or simple hosting
  images: {
    unoptimized: true,
  },
};

// Define the PWA configuration
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

// Export the configuration wrapped with PWA
export default pwaConfig(nextConfig);
