import type { Metadata } from 'next';
import { PageShell, Toc } from '@/components';
import { socialMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'სარჩევი - თავის ქალა არტისტული ყვავილებით',
  description: 'სარჩევის გვერდი, ლექსებს შორის ნავიგაციის გასამარტივებლად',
  ...socialMeta({
    title: 'სარჩევი - არტისტული ყვავილები',
    description: 'სარჩევის გვერდი',
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
