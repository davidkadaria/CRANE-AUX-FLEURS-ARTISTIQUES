// Generates social/meta images into public/meta/<page>/ for every page
// (poem-1…poem-86, cover, sarchevi, epigrafebi, not-found). Per page:
//
//   og.jpg        1200×630   og:image (social crawlers want jpg)
//   twitter.jpg   1200×600   twitter:image (exact 2:1)
//   still.*       1280×720   16:9 ┐
//   card.*        1200×900   4:3  ├ the three ratios Google rich results
//   thumb.*       1200×1200  1:1  ┘ want (referenced from JSON-LD)
//   portrait.*    1000×1500  2:3  vertical shares (Pinterest, stories)
//
// * = jpg + webp + avif. ~1 260 files; a content-hash cache (.og-cache.json)
// skips unchanged pages, so only the first run and edited poems are slow.
//
// Run: npm run build:og (chained into prebuild after build:poems).
//
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import wawoff2 from 'wawoff2';

// Bump to force full regeneration after layout changes in this script
const LAYOUT_VERSION = 6;

const root = (p) => fileURLToPath(new URL('../' + p, import.meta.url));
const poems = JSON.parse(readFileSync(root('src/data/poems.json'), 'utf8'));
const metaDir = root('public/meta/');
const cachePath = root('.og-cache.json');

const VARIANTS = [
  { name: 'og', width: 1200, height: 630, formats: ['jpg'] },
  { name: 'twitter', width: 1200, height: 600, formats: ['jpg'] },
  { name: 'still', width: 1280, height: 720, formats: ['jpg', 'webp', 'avif'] },
  { name: 'card', width: 1200, height: 900, formats: ['jpg', 'webp', 'avif'] },
  {
    name: 'thumb',
    width: 1200,
    height: 1200,
    formats: ['jpg', 'webp', 'avif'],
  },
  {
    name: 'portrait',
    width: 1000,
    height: 1500,
    formats: ['jpg', 'webp', 'avif'],
  },
];

// ---------------------------------------------------------------- palette
// Design tokens from src/styles/variables.css (light / paper theme)
const PAGE = '#f5efdf';
const INK = '#2b2a26';
const MUTED = '#6f6448';

// ---------------------------------------------------------------- fonts
// Same families the site uses, decompressed from the site's own woff2 files
// (satori reads ttf/otf/woff, not woff2).
async function loadFont(file) {
  return Buffer.from(
    await wawoff2.decompress(readFileSync(root('public/fonts/' + file))),
  );
}

const fonts = [
  { name: 'BPG WEB 002 Caps', file: 'bpg-web-002-caps.woff2' },
  { name: 'BPG Classic Medium', file: 'bpg-classic-medium.woff2' },
  { name: 'PT Serif', file: 'pt-serif.woff2' },
  { name: 'PT Serif', file: 'pt-serif-italic.woff2', style: 'italic' },
  { name: 'Philosopher', file: 'philosopher-bold.woff2', weight: 700 },
  { name: 'Noto Sans Georgian', file: 'noto-sans-georgian-georgian.woff2' },
  { name: 'Noto Sans Georgian', file: 'noto-sans-georgian-latin.woff2' },
];
for (const font of fonts) {
  font.data = await loadFont(font.file);
  font.weight ??= 400;
  font.style ??= 'normal';
}

const FONT_TITLE = 'BPG WEB 002 Caps';
const FONT_BODY = 'BPG Classic Medium';
const FONT_LATIN = 'PT Serif';
const FONT_UI = 'Noto Sans Georgian';

const portraitBytes = readFileSync(root('assets/galaktioni.jpg'));
const portraitSrc = `data:image/jpeg;base64,${portraitBytes.toString('base64')}`;

// ---------------------------------------------------------------- helpers
const el = (type, style, children) => ({ type, props: { style, children } });

// The frame every image shares. Landscape/square variants: portrait photo
// left, paper panel right. Tall (2:3) variants: photo top, panel below.
// withPhoto: false drops the portrait entirely (404 card  owner, 2026-07-31).
function frame(variant, children, { withPhoto = true } = {}) {
  const tall = variant.height / variant.width > 1.2;
  const photo = tall
    ? {
        type: 'img',
        props: {
          src: portraitSrc,
          width: variant.width,
          height: Math.round(variant.height * 0.44),
          style: { objectFit: 'cover', objectPosition: '50% 18%' },
        },
      }
    : {
        type: 'img',
        props: {
          src: portraitSrc,
          width: Math.round(variant.width * 0.365),
          height: variant.height,
          style: { objectFit: 'cover' },
        },
      };
  return el(
    'div',
    {
      width: variant.width,
      height: variant.height,
      display: 'flex',
      flexDirection: tall ? 'column' : 'row',
      backgroundColor: PAGE,
    },
    [
      ...(withPhoto ? [photo] : []),
      el(
        'div',
        {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: tall ? '44px 56px 38px' : '48px 60px 40px',
          color: INK,
        },
        children,
      ),
    ],
  );
}

// Scale for cramped variants (twitter @600px tall)  1 everywhere else
const scaleOf = (variant) => Math.min(1, variant.height / 630);

// Shared top band: author left, `right` (year etc.) right, running-header rule
function masthead(s, right = 'MCMXIX') {
  return [
    el(
      'div',
      {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
      },
      [
        el(
          'div',
          {
            fontFamily: FONT_TITLE,
            fontSize: Math.round(20 * s),
            letterSpacing: 5,
          },
          'გალაკტიონ ტაბიძე',
        ),
        ...(right
          ? [
              el(
                'div',
                {
                  fontFamily: FONT_LATIN,
                  fontSize: Math.round(17 * s),
                  letterSpacing: right === 'MCMXIX' ? 4 : 1,
                  color: MUTED,
                },
                right,
              ),
            ]
          : []),
      ],
    ),
    el('div', {
      height: 2,
      backgroundColor: INK,
      marginTop: Math.round(14 * s),
    }),
  ];
}

function footer(s, text) {
  return el(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Math.round(16 * s),
    },
    [
      el(
        'div',
        {
          flexShrink: 0,
          fontFamily: FONT_UI,
          fontSize: Math.round(16 * s),
          letterSpacing: 2,
          color: MUTED,
        },
        text,
      ),
      // Separator between the Georgian and French titles (owner, 2026-07-31;
      // satori draws neither dotted nor dashed borders, so a middle dot it is)
      el(
        'div',
        {
          fontFamily: FONT_LATIN,
          fontSize: Math.round(16 * s),
          color: MUTED,
        },
        '·',
      ),
      el(
        'div',
        {
          flexShrink: 0,
          fontFamily: FONT_LATIN,
          fontStyle: 'italic',
          fontSize: Math.round(16 * s),
          letterSpacing: 2,
          color: MUTED,
        },
        'Crâne aux fleurs artistiques',
      ),
    ],
  );
}

// Title only  no excerpt (owner, 2026-07-31); centered on the paper panel
function poemCard(poem, variant) {
  const s = scaleOf(variant);
  const base = poem.title.length > 34 ? 30 : poem.title.length > 22 ? 36 : 42;
  return frame(variant, [
    ...masthead(s, poem.year ?? ''),
    el('div', { flex: 1 }),
    el(
      'div',
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      },
      [
        el(
          'div',
          {
            fontFamily: FONT_TITLE,
            fontSize: Math.round(base * s),
            letterSpacing: 3,
            lineHeight: 1.5,
          },
          poem.title,
        ),
      ],
    ),
    el('div', { flex: 1 }),
    footer(s, 'თავის ქალა არტისტული ყვავილებით'),
  ]);
}

// Structured like the printed cover (and the site's landing page): author on
// top, French title dominant in the middle, MCMXIX / ტფილისი at the foot 
// everything centered, no author photo (owner, 2026-07-31), pure typography.
function coverCard(variant) {
  const s = scaleOf(variant);
  return frame(
    variant,
    [
      el(
        'div',
        {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        [
          el(
            'div',
            {
              fontFamily: FONT_TITLE,
              fontSize: Math.round(20 * s),
              letterSpacing: 6,
            },
            'გალაკტიონ ტაბიძე',
          ),
          el('div', { flex: 1 }),
          el(
            'div',
            {
              fontFamily: 'Philosopher',
              fontWeight: 700,
              fontSize: Math.round(42 * s),
              letterSpacing: 3,
              lineHeight: 1.4,
            },
            'CRÂNE AUX FLEURS ARTISTIQUES',
          ),
          el(
            'div',
            {
              fontFamily: FONT_TITLE,
              fontSize: Math.round(19 * s),
              letterSpacing: 3,
              color: MUTED,
              marginTop: Math.round(26 * s),
            },
            'თავის ქალა არტისტული ყვავილებით',
          ),
          el(
            'div',
            {
              fontFamily: FONT_LATIN,
              fontSize: Math.round(18 * s),
              letterSpacing: 2,
              color: MUTED,
              marginTop: Math.round(16 * s),
            },
            '(1914 - 1919)',
          ),
          el('div', { flex: 1 }),
          el(
            'div',
            {
              fontFamily: FONT_LATIN,
              fontSize: Math.round(17 * s),
              fontWeight: 400,
              letterSpacing: 4,
            },
            'MCMXIX',
          ),
          el(
            'div',
            {
              fontFamily: FONT_TITLE,
              fontSize: Math.round(16 * s),
              letterSpacing: 3,
              marginTop: Math.round(8 * s),
            },
            'ტფილისი',
          ),
        ],
      ),
    ],
    { withPhoto: false },
  );
}

function pageCard(variant, title, subtitle, subtitleStyle = {}) {
  const s = scaleOf(variant);
  return frame(variant, [
    ...masthead(s),
    el('div', { flex: 1 }),
    el('div', { display: 'flex', flexDirection: 'column' }, [
      el(
        'div',
        {
          fontFamily: FONT_TITLE,
          fontSize: Math.round(42 * s),
          letterSpacing: 5,
        },
        title,
      ),
      el(
        'div',
        {
          fontFamily: FONT_BODY,
          fontSize: Math.round(22 * s),
          color: MUTED,
          marginTop: Math.round(22 * s),
          ...subtitleStyle,
        },
        subtitle,
      ),
    ]),
    el('div', { flex: 1 }),
    footer(s, 'თავის ქალა არტისტული ყვავილებით'),
  ]);
}

// 404 card: no author photo (owner)  just the message on paper
function notFoundCard(variant) {
  const s = scaleOf(variant);
  return frame(
    variant,
    [
      ...masthead(s),
      el('div', { flex: 1 }),
      el(
        'div',
        {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        },
        [
          el(
            'div',
            {
              fontFamily: FONT_TITLE,
              fontSize: Math.round(40 * s),
              letterSpacing: 5,
            },
            'გვერდი ვერ მოიძებნა',
          ),
          el(
            'div',
            {
              fontFamily: FONT_BODY,
              fontSize: Math.round(21 * s),
              color: MUTED,
              marginTop: Math.round(20 * s),
            },
            'ეს ფურცელი წიგნში არ არის',
          ),
        ],
      ),
      el('div', { flex: 1 }),
      footer(s, 'თავის ქალა არტისტული ყვავილებით'),
    ],
    { withPhoto: false },
  );
}

// Epigraphs card: nothing but the four epigraphs from the printed book
// (same texts/spellings as the site's Epigraphs component).
const EPIGRAPHS = [
  {
    lines: ['Le charme inattendu d’un bijou rose', 'et noir,'],
    author: 'Baudelaire',
  },
  {
    lines: ['La demoiselle bleue aux bords frais', 'de la source,'],
    author: 'Th. Gautier',
  },
  { lines: ['La melancolie des soleils couchants,'], author: 'Paul Verlaine' },
  { lines: ['...et les roses trop hautes.'], author: 'H. de Régnier' },
];

function epigraphsCard(variant) {
  const s = scaleOf(variant);
  return frame(variant, [
    el('div', { flex: 1 }),
    el(
      'div',
      { display: 'flex', flexDirection: 'column', alignItems: 'center' },
      EPIGRAPHS.map((epigraph, index) =>
        el(
          'div',
          {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 520,
            marginTop: index === 0 ? 0 : Math.round(34 * s),
          },
          [
            ...epigraph.lines.map((line) =>
              el(
                'div',
                {
                  fontFamily: FONT_LATIN,
                  fontStyle: 'italic',
                  fontSize: Math.round(22 * s),
                  lineHeight: 1.6,
                  color: INK,
                },
                line,
              ),
            ),
            el(
              'div',
              {
                fontFamily: FONT_LATIN,
                fontSize: Math.round(16 * s),
                letterSpacing: 1,
                color: MUTED,
                marginTop: Math.round(6 * s),
                alignSelf: 'flex-end',
              },
              ` ${epigraph.author}`,
            ),
          ],
        ),
      ),
    ),
    el('div', { flex: 1 }),
  ]);
}

// ---------------------------------------------------------------- pages
const pages = [
  { slug: 'cover', key: 'cover', build: (v) => coverCard(v) },
  {
    slug: 'sarchevi',
    key: `sarchevi:${poems.length}`,
    build: (v) => pageCard(v, 'სარჩევი', `${poems.length} ლექსი`),
  },
  {
    slug: 'epigrafebi',
    key: 'epigrafebi',
    build: (v) => epigraphsCard(v),
  },
  {
    slug: 'not-found',
    key: 'not-found',
    build: (v) => notFoundCard(v),
  },
  ...poems.map((poem) => ({
    slug: `poem-${poem.id}`,
    key: poem,
    build: (v) => poemCard(poem, v),
  })),
];

// ---------------------------------------------------------------- render
const portraitHash = createHash('sha1').update(portraitBytes).digest('hex');
const pageHash = (page) =>
  createHash('sha1')
    .update(JSON.stringify([LAYOUT_VERSION, VARIANTS, portraitHash, page.key]))
    .digest('hex');

let cache = {};
try {
  cache = JSON.parse(readFileSync(cachePath, 'utf8'));
} catch {
  // first run
}

function upToDate(page, hash) {
  if (cache[page.slug] !== hash) return false;
  return VARIANTS.every((variant) =>
    variant.formats.every((format) =>
      existsSync(`${metaDir}${page.slug}/${variant.name}.${format}`),
    ),
  );
}

async function encode(png, format, path) {
  const image = sharp(png);
  if (format === 'jpg')
    await image.jpeg({ quality: 85, mozjpeg: true }).toFile(path);
  else if (format === 'webp') await image.webp({ quality: 82 }).toFile(path);
  else await image.avif({ quality: 55, effort: 3 }).toFile(path);
}

// Design-iteration helper: ONLY=cover,poem-2 npm run build:og
const only = process.env.ONLY?.split(',');

let built = 0;
let skipped = 0;
for (const page of pages) {
  if (only && !only.includes(page.slug)) continue;
  const hash = pageHash(page);
  if (upToDate(page, hash)) {
    skipped++;
    continue;
  }
  const dir = `${metaDir}${page.slug}/`;
  mkdirSync(dir, { recursive: true });
  for (const variant of VARIANTS) {
    const svg = await satori(page.build(variant), {
      width: variant.width,
      height: variant.height,
      fonts,
    });
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: variant.width },
    })
      .render()
      .asPng();
    await Promise.all(
      variant.formats.map((format) =>
        encode(png, format, `${dir}${variant.name}.${format}`),
      ),
    );
  }
  cache[page.slug] = hash;
  built++;
}

writeFileSync(cachePath, JSON.stringify(cache, null, 2) + '\n');
console.log(
  `✓ meta images: ${built} page(s) built, ${skipped} unchanged → public/meta/`,
);
