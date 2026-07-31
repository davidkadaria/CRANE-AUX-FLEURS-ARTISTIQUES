'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Invisible helper: keyboard ←/→ and horizontal swipe navigate to prev/next poem.

const SWIPE_MIN_X = 60;
const SWIPE_XY_RATIO = 1.5;

type PoemNavProps = {
  prevHref?: string;
  nextHref?: string;
};

export function PoemNav({ prevHref, nextHref }: PoemNavProps) {
  const router = useRouter();

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;

    function handleKeyDown(event: KeyboardEvent) {
      // Plain arrows only - Alt+Left is the browser's own Back, and arrows
      // inside inputs must keep editing the input
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      const target = event.target as HTMLElement;
      if (
        target.isContentEditable ||
        /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      )
        return;
      if (event.key === 'ArrowLeft' && prevHref) router.push(prevHref);
      if (event.key === 'ArrowRight' && nextHref) router.push(nextHref);
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      tracking = true;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
    }

    function handleTouchEnd(event: TouchEvent) {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      if (Math.abs(deltaX) < SWIPE_MIN_X) return;
      if (Math.abs(deltaX) < Math.abs(deltaY) * SWIPE_XY_RATIO) return;
      if (deltaX < 0 && nextHref) router.push(nextHref);
      if (deltaX > 0 && prevHref) router.push(prevHref);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [prevHref, nextHref, router]);

  return null;
}
