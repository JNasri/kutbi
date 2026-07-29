type VisaStep = { title: string; text: string };
type VisaCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  steps: readonly VisaStep[];
};

export default function UmrahVisa({ copy }: { copy: VisaCopy }) {
  return (
    <section id="umrah-visa" className="content-section visa-section">
      <div className="section-heading content-wrap">
        <p>{copy.kicker}</p>
        <h2>{copy.title}</h2>
        <span>{copy.subtitle}</span>
      </div>

      <div className="visa-steps content-wrap">
        <div className="visa-route" aria-hidden="true" />
        {copy.steps.map((step, index) => (
          <article className="visa-step" key={step.title}>
            <div className="visa-step-number">
              <small>STEP</small>
              <span>0{index + 1}</span>
            </div>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
