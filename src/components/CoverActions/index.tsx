'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/Icon';
import { getPoemById, type Poem } from '@/data';
import { getBookmarks, getLastRead } from '@/lib/storage';
import './CoverActions.css';

export function CoverActions() {
  const [lastRead, setLastRead] = useState<Poem | null>(null);
  const [bookmark, setBookmark] = useState<Poem | null>(null);

  useEffect(() => {
    const lastReadId = getLastRead();
    // localStorage is read after mount so the first client render matches the
    // prerendered HTML (static export)  the one-time post-hydration setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (lastReadId != null) setLastRead(getPoemById(lastReadId) ?? null);
    const bookmarks = getBookmarks();
    if (bookmarks.length > 0) {
      setBookmark(getPoemById(bookmarks[bookmarks.length - 1]) ?? null);
    }
  }, []);

  return (
    <nav className="CoverActions">
      {lastRead && (
        <Link
          className="CoverActions__action"
          href={`/poem/${lastRead.id}/`}
          data-tip={lastRead.title}
        >
          განაგრძე კითხვა · {lastRead.roman}
        </Link>
      )}
      {bookmark && (
        <Link
          className="CoverActions__action"
          href={`/poem/${bookmark.id}/`}
          data-tip={bookmark.title}
        >
          <Icon name="bookmark-solid" /> სანიშნი · {bookmark.roman}
        </Link>
      )}
      <Link className="CoverActions__action" href="/sarchevi/">
        სარჩევი
      </Link>
    </nav>
  );
}
