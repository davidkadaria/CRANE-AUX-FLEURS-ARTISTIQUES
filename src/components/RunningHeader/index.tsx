import Link from 'next/link';
import './RunningHeader.css';

export function RunningHeader() {
  return (
    <header className="RunningHeader">
      <Link
        className="RunningHeader__row"
        href="/"
        aria-label="საწყის გვერდზე დაბრუნება"
        data-tip="საწყის გვერდზე დაბრუნება"
        data-tip-side="bottom"
      >
        <span className="RunningHeader__author">გალაკტიონი</span>
        <span className="RunningHeader__brand">
          Crâne aux fleurs artistiques
        </span>
      </Link>
      <div className="RunningHeader__rule" />
    </header>
  );
}
