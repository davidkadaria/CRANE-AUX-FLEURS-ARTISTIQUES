import { Icon } from '@/components/Icon';
import './Colophon.css';

const REPO_URL = 'https://github.com/davidkadaria/CRANE-AUX-FLEURS-ARTISTIQUES';

export function Colophon() {
  return (
    <p className="Colophon">
      <span className="Colophon__copy">© 2026</span>
      <a
        className="Colophon__github"
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub რეპოზიტორია"
        data-tip="GitHub"
      >
        <Icon name="github" />
      </a>
    </p>
  );
}
