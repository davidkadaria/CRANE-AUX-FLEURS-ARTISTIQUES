import type { Metadata } from 'next';
import { Cover } from '@/components';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function CoverPage() {
  return <Cover />;
}
