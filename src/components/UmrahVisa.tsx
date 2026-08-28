import { Link } from "react-router";

type VisaStep = {
  title: string;
  text: string;
  link: string;
  linkLabel: string;
};
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

            {/* 1. Added flex, flex-col, and h-full here to make this container take full height */}
            <div className="flex flex-col h-full">
              <h3>{step.title}</h3>
              <p>{step.text}</p>

              {/* 2. Added mt-auto to push the link down, and inline-flex/self-start to keep its native width */}
              <Link
                to={step.link}
                className="visa-step-link mt-auto inline-flex self-start"
              >
                <span>{step.linkLabel}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
