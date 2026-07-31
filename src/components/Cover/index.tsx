import Link from 'next/link';
import { CoverActions } from '@/components/CoverActions';
import { Icon } from '@/components/Icon';
import './Cover.css';

export function Cover() {
  return (
    <div className="Cover">
      <div className="Cover__frame">
        <div className="Cover__inner">
          <p className="Cover__author">გალაკტიონ ტაბიძე</p>
          <div className="Cover__middle">
            <h1 className="Cover__title" lang="fr">
              CRÂNE AUX
              <br />
              FLEURS ARTISTIQUES
            </h1>
            <p className="Cover__years">(1914 - 1919)</p>
          </div>
          <div className="Cover__bottom">
            <p className="Cover__mcmxix">MCMXIX</p>
            <p className="Cover__city">ტფილისი</p>
            <Link className="Cover__hint" href="/epigrafebi/">
              დაიწყე კითხვა{' '}
              <Icon name="arrow-right" className="Cover__hintArrow" />
            </Link>
          </div>
        </div>
      </div>
      <CoverActions />
    </div>
  );
}
