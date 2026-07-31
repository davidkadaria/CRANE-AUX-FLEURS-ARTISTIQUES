import type { Metadata } from 'next';
import Link from 'next/link';
import { FooterBar, PageShell } from '@/components';
import { socialMeta } from '@/lib/site';
import './not-found.css';

export const metadata: Metadata = {
  title: 'გვერდი ვერ მოიძებნა - არტისტული ყვავილები',
  ...socialMeta({
    title: 'გვერდი ვერ მოიძებნა - არტისტული ყვავილები',
    slug: 'not-found',
  }),
};

export default function NotFound() {
  return (
    <PageShell
      footer={<FooterBar below={<Link href="/sarchevi/">სარჩევი</Link>} />}
    >
      <div className="NotFound">
        <h1 className="NotFound__title">გვერდი ვერ მოიძებნა</h1>
        <p className="NotFound__hint">
          ეს ფურცელი წიგნში არ არის - დაბრუნდი{' '}
          <Link className="NotFound__link" href="/">
            გარეკანზე
          </Link>{' '}
          ან გახსენი{' '}
          <Link className="NotFound__link" href="/sarchevi/">
            სარჩევი
          </Link>
          .
        </p>
      </div>
    </PageShell>
  );
}
