import type { Metadata } from 'next';
import Link from 'next/link';
import { Epigraphs, FooterBar, Icon, PageShell } from '@/components';
import { getPoemById } from '@/data';
import { socialMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ეპიგრაფები - თავის ქალა არტისტული ყვავილებით',
  description: 'კრებულის დასაწყისში წამძღვარებული ოთხი ციტატა',
  alternates: { canonical: '/epigrafebi/' },
  ...socialMeta({
    title: 'ეპიგრაფები - არტისტული ყვავილები',
    description: 'კრებულის დასაწყისში წამძღვარებული ციტატები',
    slug: 'epigrafebi',
  }),
};

export default function EpigraphsPage() {
  return (
    <PageShell
      footer={
        <FooterBar
          right={
            <Link
              href="/poem/1/"
              aria-label={`პირველი ლექსი: ${getPoemById(1)?.title}`}
              data-tip={getPoemById(1)?.title}
              data-tip-pos="right"
            >
              I <Icon name="chevron-right" />
            </Link>
          }
          below={<Link href="/sarchevi/">სარჩევი</Link>}
        />
      }
    >
      <Epigraphs />
    </PageShell>
  );
}
