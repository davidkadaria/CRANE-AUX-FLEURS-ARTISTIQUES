import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FooterBar,
  Icon,
  PageShell,
  PoemNav,
  PoemView,
  ReadingControls,
} from '@/components';
import { getPoemById, poems } from '@/data';
import { socialMeta, structuredImages } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return poems.map((poem) => ({ id: String(poem.id) }));
}

type PoemPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PoemPageProps): Promise<Metadata> {
  const { id } = await params;
  const poem = getPoemById(Number(id));
  if (!poem) return {};
  const title = `${poem.title} - არტისტული ყვავილები`;
  return {
    title,
    description: `${poem.firstLine}… - გალაკტიონ ტაბიძე, არტისტული ყვავილები (1919), ${poem.roman}`,
    ...socialMeta({
      title: poem.title,
      description: `${poem.firstLine}…`,
      slug: `poem-${poem.id}`,
    }),
  };
}

export default async function PoemPage({ params }: PoemPageProps) {
  const { id } = await params;
  const poem = getPoemById(Number(id));
  if (!poem) return null;
  const prev = getPoemById(poem.id - 1);
  const next = getPoemById(poem.id + 1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: poem.title,
    author: { '@type': 'Person', name: 'გალაკტიონ ტაბიძე' },
    isPartOf: {
      '@type': 'Book',
      name: 'თავის ქალა არტისტული ყვავილებით',
      datePublished: '1919',
    },
    inLanguage: 'ka',
    image: structuredImages(`poem-${poem.id}`),
  };

  return (
    <PageShell
      footer={
        <FooterBar
          left={
            prev ? (
              <Link
                href={`/poem/${prev.id}/`}
                aria-label={`წინა ლექსი: ${prev.title}`}
                data-tip={prev.title}
                data-tip-pos="left"
              >
                <Icon name="chevron-left" /> {prev.roman}
              </Link>
            ) : (
              <Link
                href="/epigrafebi/"
                aria-label="ეპიგრაფები"
                data-tip="ეპიგრაფები"
                data-tip-pos="left"
              >
                <Icon name="chevron-left" />
              </Link>
            )
          }
          center={<ReadingControls poemId={poem.id} />}
          right={
            next && (
              <Link
                href={`/poem/${next.id}/`}
                aria-label={`შემდეგი ლექსი: ${next.title}`}
                data-tip={next.title}
                data-tip-pos="right"
              >
                {next.roman} <Icon name="chevron-right" />
              </Link>
            )
          }
          below={<Link href="/sarchevi/">სარჩევი</Link>}
        />
      }
    >
      <PoemNav
        prevHref={prev ? `/poem/${prev.id}/` : '/epigrafebi/'}
        nextHref={next && `/poem/${next.id}/`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PoemView poem={poem} />
    </PageShell>
  );
}
