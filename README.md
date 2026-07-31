# თავის ქალა არტისტული ყვავილებით

**Crâne aux Fleurs Artistiques** - a web edition of Galaktion Tabidze's 1919
poetry collection. 86 poems, Georgian-only, phone-first, built as a facsimile
of the printed book: cream paper, letterpress typography, running headers,
roman numerals.

**Live: [galaktioni.ge](https://galaktioni.ge)**

![Cover](https://galaktioni.ge/meta/cover/og.jpg)

## Features

- One page per poem, prev/next navigation, keyboard ←/→ and swipe
- Table of contents with dotted leaders, live search over titles and full text
- Reading preferences (persisted locally): text size, dark mode
  ("night facsimile"), bookmarks, last-read position
- Generated social meta images for every page (Open Graph / Twitter /
  Google rich-result ratios) in the site's own typography
- Original skull-with-bouquet mark as favicon / app icon, PWA manifest
- Fully static - no server, no database, no tracking beyond GA4

## Stack

Next.js (App Router, static export) · TypeScript · vanilla CSS (BEM,
mobile-first) · satori + resvg + sharp for build-time imagery ·
self-hosted Georgian fonts.

## Development

```bash
npm install
npm run dev            # develop (poems.json regenerates automatically)
npm run build          # static export → out/ (also regenerates meta images + icons)
npm run lint           # eslint
npm run format         # prettier
npm run validate:poems # sanity-check the poem data
```

## Content

Poem texts live in `content/poems/NNN-slug.md` - one file per poem, plain
markdown-ish format documented in `content/poems/README.md`. Everything else
(`src/data/poems.json`, meta images, icons) is generated from them at build
time. Edit the files, never the JSON.

## License

[PolyForm Noncommercial 1.0.0](LICENSE.md) - free to read, run, copy, and
modify for any noncommercial purpose. Copyright © 2026 Dato Kadaria.
