import type { Metadata } from 'next';
import { PageShell, Toc } from '@/components';
import { socialMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'სარჩევი - თავის ქალა არტისტული ყვავილებით',
  ...socialMeta({
    title: 'სარჩევი - თავის ქალა არტისტული ყვავილებით',
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
