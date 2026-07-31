import type { ReactNode } from 'react';
import { RunningHeader } from '../RunningHeader';
import './PageShell.css';

type PageShellProps = {
  footer?: ReactNode;
  children: ReactNode;
};

export function PageShell({ footer, children }: PageShellProps) {
  return (
    <div className="PageShell">
      <RunningHeader />
      <main className="PageShell__content">{children}</main>
      {footer}
    </div>
  );
}
