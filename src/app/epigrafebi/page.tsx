import type { Metadata } from 'next';
import Link from 'next/link';
import { Epigraphs, FooterBar, Icon, PageShell } from '@/components';
import { getPoemById } from '@/data';
import { socialMeta } from '@/lib/site';

export const metadata: Metadata = {
  title: 'ეპიგრაფები - არტისტული ყვავილები',
  ...socialMeta({
    title: 'ეპიგრაფები - არტისტული ყვავილები',
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
