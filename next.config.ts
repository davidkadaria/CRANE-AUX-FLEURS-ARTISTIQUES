import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Dev only: allow opening the dev server from other devices on the LAN
  // (e.g. a phone at http://172.28.0.32:3000). Update if the machine's IP changes.
  allowedDevOrigins: ['172.28.0.32'],
  // No `output: 'export'` since 2026-07-31: every page is still fully
  // prerendered (SSG), but the edit-request API route needs a serverless
  // function on Vercel - static export cannot host one.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
