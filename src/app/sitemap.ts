import type { MetadataRoute } from 'next';
import { poems } from '@/data';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, priority: 1 },
    { url: `${SITE_URL}/sarchevi/`, priority: 0.8 },
    { url: `${SITE_URL}/epigrafebi/`, priority: 0.5 },
    ...poems.map((poem) => ({
      url: `${SITE_URL}/poem/${poem.id}/`,
      priority: 0.7,
    })),
  ];
}
