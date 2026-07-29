import type { FormEvent } from 'react';

type Testimonial = { quote: string; source: string };
type ContactFormCopy = {
  name: string;
  email: string;
  message: string;
  send: string;
  subject: string;
};
type TestimonialsContactCopy = {
  kicker: string;
  title: string;
  testimonials: readonly Testimonial[];
  contactTitle: string;
  contactIntro: string;
  channels: readonly string[];
  form: ContactFormCopy;
  email: string;
};

export default function TestimonialsContact({ copy }: { copy: TestimonialsContactCopy }) {
  const sendEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = [
      `${copy.form.name}: ${form.get('name') ?? ''}`,
      `${copy.form.email}: ${form.get('email') ?? ''}`,
      '',
      String(form.get('message') ?? ''),
    ].join('\n');
    window.location.href = `mailto:${copy.email}?subject=${encodeURIComponent(copy.form.subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="content-section testimonials-contact-section">
      <div className="section-heading content-wrap">
        <p>{copy.kicker}</p>
        <h2>{copy.title}</h2>
      </div>

      <div className="testimonial-grid content-wrap">
        {copy.testimonials.map((testimonial, index) => (
          <blockquote key={testimonial.source}>
            <span aria-hidden="true">“</span>
            <p>{testimonial.quote}</p>
            <footer><small>0{index + 1}</small><cite>{testimonial.source}</cite></footer>
          </blockquote>
        ))}
      </div>

      <div className="contact-panel content-wrap">
        <div className="contact-copy">
          <small>ALKUTBI GROUP</small>
          <h3>{copy.contactTitle}</h3>
          <p>{copy.contactIntro}</p>
          <ul>{copy.channels.map((channel) => <li key={channel}><i>↗</i><span>{channel}</span></li>)}</ul>
        </div>

        <form className="public-contact-form" onSubmit={sendEmail}>
          <label>
            <span>{copy.form.name}</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>{copy.form.email}</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>{copy.form.message}</span>
            <textarea name="message" rows={5} required />
          </label>
          <button className="button button-gold" type="submit">{copy.form.send}<span>↗</span></button>
        </form>
      </div>
    </section>
  );
}
