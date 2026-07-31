import type { Metadata } from 'next';
import { PageShell, Toc } from '@/components';
import { socialMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'სარჩევი - არტისტული ყვავილები',
  ...socialMeta({
    title: 'სარჩევი - არტისტული ყვავილები',
    description: '86 ლექსი',
    slug: 'sarchevi',
  }),
};

export default function TocPage() {
  return (
    <PageShell>
      <Toc />
    </PageShell>
  );
}
