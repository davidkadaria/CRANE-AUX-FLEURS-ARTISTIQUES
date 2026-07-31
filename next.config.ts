import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev only: allow opening the dev server from other devices on the LAN
  // (e.g. a phone at http://172.28.0.32:3000). Update if the machine's IP changes.
  allowedDevOrigins: ['172.28.0.32'],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
