import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Flower2, Music2, Sparkles, Sun } from "lucide-react";
import { photos } from "./photos";

const celebrations = [
  {
    title: "Mehndi Evenings",
    description:
      "Henna artists, a dholki playlist and a cosy corner for the stories everyone will retell for years.",
    caption: "Love, written in henna.",
    icon: Sparkles,
    photo: photos.mehndi,
  },
  {
    title: "Haldi Mornings",
    description:
      "Marigolds, turmeric and a sunlit setting made for laughter, blessings and a little happy mess.",
    caption: "A little sunshine. A lot of love.",
    icon: Sun,
    photo: photos.haldi,
  },
  {
    title: "Sangeet Nights",
    description:
      "A stage, a great sound system and rehearsed surprises, so every side of the family gets its moment.",
    caption: "One more song. Always.",
    icon: Music2,
    photo: photos.sangeet,
  },
  {
    title: "Florals & Decor",
    description:
      "Marigold arches, flowing drapes and fresh blooms, styled to the colours of your story.",
    caption: "Your vision, in full bloom.",
    icon: Flower2,
    photo: photos.florals,
  },
] as const;

export function CelebrationSwitch() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = celebrations[active] ?? celebrations[0];

  function onKeyDown(e: KeyboardEvent) {
    const step =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + celebrations.length) % celebrations.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section id="celebrations" className="celebration-section" aria-labelledby={`${id}-heading`}>
      <div className="celebration-heading">
        <span className="eyebrow">EVERY CELEBRATION</span>
        <h2 id={`${id}-heading`}>
          Four moments.
          <br />
          One beautiful plan.
        </h2>
      </div>
      <div className="celebration-switch">
        <div
          className="celebration-tabs"
          role="tablist"
          aria-label="Wedding celebrations"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
        >
          {celebrations.map((item, i) => (
            <button
              key={item.title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`${id}-panel`}
              tabIndex={active === i ? 0 : -1}
              data-active={active === i}
              className="celebration-tab"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="celebration-tab-title">{item.title}</span>
              <span className="celebration-tab-body">
                <span>{item.description}</span>
              </span>
            </button>
          ))}
        </div>
        <div
          className="celebration-frame"
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${active}`}
        >
          {celebrations.map((item, i) => (
            <img
              key={item.title}
              src={item.photo.src}
              alt={active === i ? item.photo.alt : ""}
              aria-hidden={active !== i}
              data-active={active === i}
              className="celebration-image"
              loading="lazy"
              width={1500}
              height={1000}
            />
          ))}
          <div key={current.title} className="celebration-card">
            <current.icon strokeWidth={1.25} />
            <div>
              <span className="eyebrow">{current.title}</span>
              <strong>{current.caption}</strong>
            </div>
          </div>
          <a
            className="celebration-credit"
            href={current.photo.credit.url}
            target="_blank"
            rel="noreferrer"
          >
            Photo: {current.photo.credit.author} · {current.photo.credit.license}
          </a>
        </div>
      </div>
    </section>
  );
}
