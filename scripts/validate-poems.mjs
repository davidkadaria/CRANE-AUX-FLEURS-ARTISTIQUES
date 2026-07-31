// Validates src/data/poems.json: sequential ids, correct roman numerals,
// no empty fields. Run: npm run validate:poems
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const poemsPath = fileURLToPath(
  new URL('../src/data/poems.json', import.meta.url),
);
const poems = JSON.parse(readFileSync(poemsPath, 'utf8'));

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
  return out;
}

const errors = [];

poems.forEach((poem, i) => {
  const where = `poem #${i + 1} (id ${poem.id})`;
  if (poem.id !== i + 1)
    errors.push(`${where}: id not sequential, expected ${i + 1}`);
  if (poem.roman !== toRoman(poem.id)) {
    errors.push(
      `${where}: roman "${poem.roman}" should be "${toRoman(poem.id)}"`,
    );
  }
  for (const field of ['title', 'firstLine', 'text']) {
    if (typeof poem[field] !== 'string' || poem[field].trim() === '') {
      errors.push(`${where}: empty field "${field}"`);
    }
  }
});

const placeholders = poems.filter((p) => p.text.includes('placeholder')).length;

if (errors.length > 0) {
  console.error(`✗ ${errors.length} problem(s):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log(
  `✓ ${poems.length} poems valid (${placeholders} still placeholder)`,
);
