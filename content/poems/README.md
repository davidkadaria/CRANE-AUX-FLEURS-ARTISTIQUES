# Poem sources  one poem, one file

**This folder is the single source of truth for the poem texts.**
`src/data/poems.json` is generated from it automatically (before
`npm run dev` / `npm run build` / `npm run validate:poems`; or manually via
`npm run build:poems`). Don't edit the JSON by hand  it gets overwritten.

## File format

```
# Title                  ← required, first line
year: 1915               ← optional (stored as data, not shown on the site)
place: წაღვერი           ← optional

> epigraph line          ← optional block before the text

Poem text…
A blank line = stanza break.

***                      ← optional: everything after *** is a footnote
footnote line…
```

## Rules

- Poem order = alphabetical file order → names start with an `NNN-` prefix
  (001, 002, …). When reordering or inserting, renumber the prefixes.
- `id` and the roman numeral are assigned automatically from the order.
- In multi-part poems, put the section numeral (I, II, III…) on its own
  line  it is treated as a regular text line.
- Social preview images (title + year, no excerpt) regenerate automatically
  from these files before every `npm run build` (or via `npm run build:og`).
