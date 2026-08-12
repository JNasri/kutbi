import Logo from './Logo';

type AboutCopy = {
  kicker: string;
  title: string;
  eyebrow: string;
  mark: string;
  body: string;
  facts: readonly { value: string; label: string }[];
};

export default function AboutUs({ copy }: { copy: AboutCopy }) {
  return (
    <section id="about" className="about-page" aria-labelledby="about-title">
      <div className="about-pattern" aria-hidden="true" />
      <div className="about-watermark" aria-hidden="true"><Logo decorative /></div>

      <div className="about-shell content-wrap">
        <header className="about-heading">
          <p>{copy.kicker}</p>
          <span>{copy.eyebrow}</span>
          <h1 id="about-title">{copy.title}</h1>
        </header>

        <div className="about-story">
          <span className="about-dropcap" aria-hidden="true">{copy.mark}</span>
          <p>{copy.body}</p>
        </div>

        <div className="about-facts">
          {copy.facts.map((fact, index) => (
            <article key={fact.label}>
              <small>0{index + 1}</small>
              <strong>{fact.value}</strong>
              <span>{fact.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
