'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FONT_SIZES,
  getBookmarks,
  getFontSize,
  getTheme,
  setFontSize,
  setLastRead,
  setTheme,
  toggleBookmark,
  type Theme,
} from '@/lib/storage';
import { Icon } from '@/components/Icon';
import './ReadingControls.css';

type ReadingControlsProps = {
  poemId: number;
};

const SIZE_LABELS: Record<number, string> = {
  12: 'უმცირესი ზომა',
  14: 'პატარა ზომა',
  16: 'საშუალო ზომა',
  18: 'დიდი ზომა',
};

export function ReadingControls({ poemId }: ReadingControlsProps) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [bookmarked, setBookmarked] = useState(false);
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [sizeOpen, setSizeOpen] = useState(false);
  const sizeWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // localStorage is read after mount so the first client render matches the
    // prerendered HTML (static export)  the one-time post-hydration setState is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(getTheme());
    setBookmarked(getBookmarks().includes(poemId));
    setFontSizeState(getFontSize());
    setLastRead(poemId);
  }, [poemId]);

  useEffect(() => {
    if (!sizeOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (!sizeWrapRef.current?.contains(event.target as Node)) {
        setSizeOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSizeOpen(false);
    }
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [sizeOpen]);

  function handleSelectSize(px: number) {
    setFontSize(px);
    setFontSizeState(px);
  }

  function handleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  }

  function handleBookmark() {
    setBookmarked(toggleBookmark(poemId));
  }

  return (
    <>
      <div className="ReadingControls__sizeWrap" ref={sizeWrapRef}>
        <button
          type="button"
          className={
            sizeOpen
              ? 'ReadingControls__button ReadingControls__button--active'
              : 'ReadingControls__button'
          }
          aria-label="ტექსტის ზომა"
          aria-expanded={sizeOpen}
          data-tip={sizeOpen ? undefined : 'ტექსტის ზომა'}
          onClick={() => setSizeOpen((open) => !open)}
        >
          aA
        </button>
        {sizeOpen && (
          <div
            className="ReadingControls__sizePanel"
            role="group"
            aria-label="ტექსტის ზომა"
          >
            {FONT_SIZES.map((px) => (
              <button
                key={px}
                type="button"
                className={
                  px === fontSize
                    ? 'ReadingControls__sizeOption ReadingControls__sizeOption--active'
                    : 'ReadingControls__sizeOption'
                }
                style={{ fontSize: px }}
                aria-label={SIZE_LABELS[px]}
                aria-pressed={px === fontSize}
                onClick={() => handleSelectSize(px)}
              >
                აა
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        className="ReadingControls__button"
        aria-label={theme === 'dark' ? 'ნათელი რეჟიმი' : 'ბნელი რეჟიმი'}
        data-tip={theme === 'dark' ? 'ნათელი რეჟიმი' : 'ბნელი რეჟიმი'}
        onClick={handleTheme}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      <button
        type="button"
        className={
          bookmarked
            ? 'ReadingControls__button ReadingControls__button--active'
            : 'ReadingControls__button'
        }
        aria-label={bookmarked ? 'სანიშნის მოხსნა' : 'ჩანიშვნა'}
        data-tip={bookmarked ? 'სანიშნის მოხსნა' : 'ჩანიშვნა'}
        aria-pressed={bookmarked}
        onClick={handleBookmark}
      >
        <Icon name={bookmarked ? 'bookmark-solid' : 'bookmark'} />
      </button>
    </>
  );
}
