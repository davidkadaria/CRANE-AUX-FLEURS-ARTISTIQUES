import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/site';

// Required for output: 'export'  metadata routes must opt into static
export const dynamic = 'force-static';

// Served at /manifest.webmanifest (Next metadata route; static export bakes it).
// Icons come from scripts/build-icons.mjs  regenerate with npm run build:icons.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - გალაკტიონი`,
    short_name: 'არტისტული ყვავილები',
    description:
      'გალაკტიონ ტაბიძის 1919 წელს გამოცემული პოეტური კრებულის „თავის ქალა არტისტული ყვავილებით" (Crâne aux Fleurs Artistiques) ვებ-ვერსია.',
    lang: 'ka',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5efdf',
    theme_color: '#f5efdf',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
