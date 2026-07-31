import type { ReactNode } from 'react';
import './FooterBar.css';

type FooterBarProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  below?: ReactNode;
};

export function FooterBar({ left, center, right, below }: FooterBarProps) {
  return (
    <footer className="FooterBar">
      <div className="FooterBar__row">
        <div className="FooterBar__side FooterBar__side--left">{left}</div>
        <div className="FooterBar__center">{center}</div>
        <div className="FooterBar__side FooterBar__side--right">{right}</div>
      </div>
      {below && <div className="FooterBar__below">{below}</div>}
    </footer>
  );
}
