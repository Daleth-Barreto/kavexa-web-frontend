import type {NextConfig} from 'next';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
    dest: "public",
    register: true,
    skipWaiting: true,
    cacheOnFrontEndNav: true,
    disable: process.env.NODE_ENV === "development",
    // Make sure the manifest is not generated again
    // We are creating it manually in public/manifest.json
    // to have more control.
    dynamicOptions: {
      manifest: false,
    },
  });

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  devIndicators: false,
  experimental: {
    allowedDevOrigins: [
        "*.cloudworkstations.dev",
        "*.firebase.studio",
        "*.vercel.app",
    ]
  }
};


export default withPWA(nextConfig);
