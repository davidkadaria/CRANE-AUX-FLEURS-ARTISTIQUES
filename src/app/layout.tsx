import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { GoogleAnalytics } from '@next/third-parties/google';

import { FONT_SIZES } from '@/lib/storage';
import { SITE_URL, socialMeta } from '@/lib/site';

import '@/styles/reset.css';
import '@/styles/fonts.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import '@/styles/tooltip.css';

const description =
  'გალაკტიონ ტაბიძის 1919 წელს გამოცემული პოეტური კრებულის „თავის ქალა არტისტული ყვავილებით" (Crâne aux Fleurs Artistiques) ვებ-გამოცემა';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'თავის ქალა არტისტული ყვავილებით - გალაკტიონ ტაბიძე',
  description,
  verification: {
    google: '7V7U7I4VTVg8YKXukqYXcO2dT4N5D0BQZYmgj6I07r8',
  },
  // Icon set from scripts/build-icons.mjs (V3 skull-with-bouquet mark);
  // /favicon.ico is picked up from public/ by browsers automatically
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
  ...socialMeta({
    title: 'არტისტული ყვავილები - გალაკტიონი',
    description,
    slug: 'cover',
  }),
};

// Browser chrome color follows the page theme (default light - the init
// script and setTheme() swap it to night blue when dark is active)
export const viewport: Viewport = {
  themeColor: '#f5efdf',
};

// Runs before paint: applies persisted theme (default: system) and font size  no flash.
const initReadingState = `(function () {
  try {
    var theme = localStorage.getItem('theme');
    if (theme !== 'light' && theme !== 'dark') theme = 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', '#131722');
    }
    var fontSize = Number(localStorage.getItem('fontSize'));
    if ([${FONT_SIZES.join(', ')}].indexOf(fontSize) !== -1) {
      document.documentElement.style.setProperty('--poem-font-size', fontSize + 'px');
    }
  } catch (e) {}
})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Critical fonts (body text + titles = LCP): preload to cut the
  // html -> css -> font request chain
  for (const font of ['bpg-classic-medium', 'bpg-web-002-caps']) {
    preload(`/fonts/${font}.woff2`, {
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous',
    });
  }
  return (
    <html lang="ka" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: initReadingState }} />
        {children}
        {/* GA4 - only when the build has the id (Vercel env; local builds
            without it stay analytics-free) */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
