// One outcome-line and one supporting line per item, never a feature checklist.
export function OutcomeSection({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: readonly { title: string; body: string }[];
}) {
  return (
    <section className="page-section" aria-labelledby={id}>
      <div className="page-inner">
        <h2 id={id} className="section-title" data-reveal>
          {title}
        </h2>
        <div className="outcome-grid">
          {items.map((item) => (
            <div key={item.title} className="outcome" data-reveal>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
