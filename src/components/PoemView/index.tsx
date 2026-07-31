import type { Poem } from '@/data';
import './PoemView.css';

type PoemViewProps = {
  poem: Poem;
};

export function PoemView({ poem }: PoemViewProps) {
  const stanzas = poem.text.split('\n\n');
  return (
    <article className="PoemView">
      <p className="PoemView__roman">{poem.roman}</p>
      <h1 className="PoemView__title">{poem.title}</h1>
      {poem.epigraph && (
        <p className="PoemView__epigraph">
          {poem.epigraph.split('\n').map((line, lineIndex) => (
            <span className="PoemView__line" key={lineIndex}>
              {line}
            </span>
          ))}
        </p>
      )}
      <div className="PoemView__body">
        {stanzas.map((stanza, stanzaIndex) => (
          <p className="PoemView__stanza" key={stanzaIndex}>
            {stanza.split('\n').map((line, lineIndex) => (
              <span className="PoemView__line" key={lineIndex}>
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div className="PoemView__endRule" />
      {poem.note && (
        <p className="PoemView__note">
          {poem.note.split('\n').map((line, lineIndex) => (
            <span className="PoemView__line" key={lineIndex}>
              {line}
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
