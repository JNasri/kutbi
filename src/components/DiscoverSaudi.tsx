import { useState } from 'react';

type Destination = { name: string; index: number };
type Category = { id: string; label: string; items: readonly Destination[] };
type DiscoverCopy = { kicker: string; title: string; subtitle: string; categories: readonly Category[]; add: string; added: string };

const atlasPosition = (index: number) => `${(index % 4) * (100 / 3)}% ${Math.floor(index / 4) * 50}%`;

export default function DiscoverSaudi({ copy }: { copy: DiscoverCopy }) {
  const [activeId, setActiveId] = useState(copy.categories[0].id);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const active = copy.categories.find((category) => category.id === activeId) ?? copy.categories[0];

  const toggleDestination = (name: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(name)) next.delete(name); else next.add(name);
    return next;
  });

  return <section id="discover" className="content-section discover-section">
    <div className="section-heading content-wrap"><p>{copy.kicker}</p><h2>{copy.title}</h2><span>{copy.subtitle}</span></div>
    <div className="discover-shell content-wrap">
      <div className="category-tabs" role="tablist" aria-label={copy.title}>{copy.categories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={category.id === active.id} className={category.id === active.id ? 'active' : ''} onClick={() => setActiveId(category.id)}>{category.label}</button>)}</div>
      <div className="destination-grid">{active.items.map((item) => {
        const isSelected = selected.has(item.name);
        return <article className="destination-card" key={item.name}>
          <div className="atlas-image destination-image" role="img" aria-label={item.name} style={{ backgroundPosition: atlasPosition(item.index) }} />
          <div className="destination-bar"><h3>{item.name}</h3><button type="button" className={isSelected ? 'added' : ''} onClick={() => toggleDestination(item.name)}>{isSelected ? '✓' : '+'}<span>{isSelected ? copy.added : copy.add}</span></button></div>
        </article>;
      })}</div>
    </div>
  </section>;
}
