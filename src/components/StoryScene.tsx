type SceneCopy = { id: string; number: string; kicker: string; title: string; text: string; accent: string; note: string };

export default function StoryScene({ scene, image, index }: { scene: SceneCopy; image: string; index: number }) {
  return (
    <section id={scene.id} className={`story scene scene-${index}`} aria-labelledby={`${scene.id}-title`}>
      <div className="scene-image" style={{ backgroundImage: `url(${image})` }} />
      <div className="scene-shade" />
      <div className="grain" />
      <div className="scene-rule" />
      <div className="story-content content-wrap">
        <div className="story-copy">
          <p className="eyebrow"><span>{scene.number}</span>{scene.kicker}</p>
          <h2 id={`${scene.id}-title`}>{scene.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
          <p className="story-text">{scene.text}</p>
        </div>
        <aside className="scene-detail">
          <i />
          <strong>{scene.accent}</strong>
          <span>{scene.note}</span>
        </aside>
      </div>
      <div className="scene-counter">{scene.number} <span>/</span> 03</div>
    </section>
  );
}
