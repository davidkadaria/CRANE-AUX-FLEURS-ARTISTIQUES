// Client-side reading state (localStorage): theme, fontSize, bookmarks, lastRead.
// All access is guarded  private mode / disabled storage degrades gracefully.

export type Theme = 'light' | 'dark';

export const FONT_SIZES = [12, 14, 16, 18] as const;

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function getTheme(): Theme {
  const stored = read('theme');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function setTheme(theme: Theme): void {
  write('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function getFontSize(): number {
  const stored = Number(read('fontSize'));
  return (FONT_SIZES as readonly number[]).includes(stored) ? stored : 16;
}

export function setFontSize(px: number): void {
  write('fontSize', String(px));
  document.documentElement.style.setProperty('--poem-font-size', `${px}px`);
}

export function getBookmarks(): number[] {
  try {
    const parsed = JSON.parse(read('bookmarks') ?? '[]');
    return Array.isArray(parsed)
      ? parsed.filter((id) => Number.isInteger(id))
      : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(id: number): boolean {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(id);
  if (index === -1) bookmarks.push(id);
  else bookmarks.splice(index, 1);
  write('bookmarks', JSON.stringify(bookmarks));
  return index === -1;
}

export function getLastRead(): number | null {
  const stored = Number(read('lastRead'));
  return Number.isInteger(stored) && stored > 0 ? stored : null;
}

export function setLastRead(id: number): void {
  write('lastRead', String(id));
}
