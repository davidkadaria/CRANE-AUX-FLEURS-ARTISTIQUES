import './Epigraphs.css';

// Front-matter epigraphs page, transcribed from the owner's source
// (Cran-Aux-Fleurs-Artistiques-texts/README.md); spellings corrected by the owner.
const EPIGRAPHS = [
  {
    text: 'Le charme inattendu d’un bijou rose\net noir,',
    author: 'Baudelaire',
  },
  {
    text: 'La demoiselle bleue aux bords frais\nde la source,',
    author: 'Th. Gautier',
  },
  { text: 'La melancolie des soleils couchants,', author: 'Paul Verlaine' },
  { text: '...et les roses trop hautes.', author: 'H. de Régnier' },
];

export function Epigraphs() {
  return (
    <section className="Epigraphs">
      {EPIGRAPHS.map((epigraph) => (
        <blockquote className="Epigraphs__item" key={epigraph.author}>
          <p className="Epigraphs__text">
            {epigraph.text.split('\n').map((line, lineIndex) => (
              <span className="Epigraphs__line" key={lineIndex}>
                {line}
              </span>
            ))}
          </p>
          <p className="Epigraphs__author">— {epigraph.author}</p>
        </blockquote>
      ))}
    </section>
  );
}
