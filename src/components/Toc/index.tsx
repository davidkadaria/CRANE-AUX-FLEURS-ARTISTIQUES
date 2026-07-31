'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { poems } from '@/data';
import { getBookmarks, getLastRead } from '@/lib/storage';
import { Icon } from '@/components/Icon';
import './Toc.css';

export function Toc() {
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [lastRead, setLastRead] = useState<number | null>(null);

  useEffect(() => {
    // localStorage is read after mount so the first client render matches the
    // prerendered HTML (static export)  the one-time post-hydration setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBookmarks(getBookmarks());
    setLastRead(getLastRead());
  }, []);

  const needle = query.trim();
  const shown = needle
    ? poems.filter(
        (poem) => poem.title.includes(needle) || poem.text.includes(needle),
      )
    : poems;

  return (
    <div className="Toc">
      <h1 className="Toc__heading">სარჩევი</h1>
      <input
        className="Toc__search"
        type="search"
        placeholder="ძიება…"
        aria-label="ძიება სათაურებსა და ტექსტში"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ol className="Toc__list">
        {shown.map((poem) => (
          <li className="Toc__row" key={poem.id}>
            <Link className="Toc__link" href={`/poem/${poem.id}/`}>
              <span className="Toc__title">{poem.title}</span>
              <span className="Toc__leader" aria-hidden="true" />
              {poem.id === lastRead && (
                <span
                  className="Toc__marker"
                  role="img"
                  aria-label="ბოლოს წაკითხული"
                  data-tip="ბოლოს წაკითხული"
                  data-tip-pos="right"
                >
                  <Icon name="arrow-right" />
                </span>
              )}
              {bookmarks.includes(poem.id) && (
                <span
                  className="Toc__marker"
                  role="img"
                  aria-label="ჩანიშნული"
                  data-tip="ჩანიშნული"
                  data-tip-pos="right"
                >
                  <Icon name="bookmark-solid" />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ol>
      <p className="Toc__count" aria-live="polite">
        ⋯ {shown.length} ლექსი ⋯
      </p>
    </div>
  );
}
