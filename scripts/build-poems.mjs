// Generates src/data/poems.json from content/poems/*.md  the editable source.
// Runs automatically before dev/build/validate (npm pre-hooks); or: npm run build:poems
//
// File format (see content/poems/README.md):
//   # title                    required, first line
//   year: 1915                 optional meta (year, place)
//   place: წაღვერი
//                              blank line
//   > epigraph line            optional epigraph block
//                              blank line
//   verse lines…               stanzas separated by blank lines
//
//   ***                        optional: everything after *** is a footnote
//   note line…
//
// Order = filename order (keep the NNN- prefix sequential when reordering).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const contentDir = fileURLToPath(new URL('../content/poems/', import.meta.url));
const outPath = fileURLToPath(
  new URL('../src/data/poems.json', import.meta.url),
);

function toRoman(n) {
  const table = [
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  for (const [value, symbol] of table) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  // The printed 1919 book contracts XXX to XC (e.g. poem 80 is LXC, not
  // LXXX) - non-classical, kept for facsimile fidelity (owner, 2026-07-31)
  return out.replace('XXX', 'XC');
}

const files = readdirSync(contentDir)
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .sort();
if (files.length === 0) throw new Error(`no poem files in ${contentDir}`);

const poems = files.map((file, i) => {
  const lines = readFileSync(contentDir + file, 'utf8').split('\n');

  let title = '';
  const meta = {};
  const epigraph = [];
  const verses = [];
  const noteLines = [];
  let section = 'head'; // head | text | note

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (section === 'head') {
      if (line.startsWith('# ')) {
        title = line.slice(2).trim();
        continue;
      }
      const metaMatch = line.match(/^(year|place): (.+)$/);
      if (metaMatch) {
        meta[metaMatch[1]] = metaMatch[2].trim();
        continue;
      }
      if (line.startsWith('> ')) {
        epigraph.push(line.slice(2));
        continue;
      }
      if (line === '' || line === '>') continue;
      section = 'text'; // first verse line falls through
    }

    if (section === 'text') {
      if (line === '***') {
        section = 'note';
        continue;
      }
      verses.push(line);
      continue;
    }

    if (line !== '') noteLines.push(line);
  }

  while (verses[0] === '') verses.shift();
  while (verses[verses.length - 1] === '') verses.pop();
  const text = verses.join('\n').replace(/\n{3,}/g, '\n\n');

  if (title === '') throw new Error(`${file}: missing "# title" line`);
  if (text === '') throw new Error(`${file}: no poem text`);

  const id = i + 1;
  // Bare section numerals (e.g. "I" opening a multi-part poem) don't count
  const firstLine = verses.find((v) => v !== '' && !/^[IVXLC]+$/.test(v)) ?? '';

  return {
    id,
    roman: toRoman(id),
    title,
    firstLine,
    text,
    ...(epigraph.length > 0 && { epigraph: epigraph.join('\n') }),
    ...(meta.year && { year: meta.year }),
    ...(meta.place && { place: meta.place }),
    ...(noteLines.length > 0 && { note: noteLines.join('\n') }),
  };
});

writeFileSync(outPath, JSON.stringify(poems, null, 2) + '\n');
console.log(`✓ built ${poems.length} poems → src/data/poems.json`);
