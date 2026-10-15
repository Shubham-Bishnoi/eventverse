import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Flower2, Music2, Sparkles, Sun } from "lucide-react";
import mehndi from "@/assets/celebration-mehndi.jpg";
import haldi from "@/assets/celebration-haldi.jpg";
import sangeet from "@/assets/celebration-sangeet.jpg";
import florals from "@/assets/celebration-florals.jpg";

// Photos from Wikimedia Commons; their CC BY-SA licences require the visible credit rendered on each image.
const celebrations = [
  {
    title: "Mehndi Evenings",
    description:
      "Henna artists, a dholki playlist and a cosy corner for the stories everyone will retell for years.",
    caption: "Love, written in henna.",
    icon: Sparkles,
    image: mehndi,
    alt: "An artist drawing an intricate henna pattern on a hand",
    credit: {
      author: "Bandan",
      license: "CC BY-SA 3.0",
      url: "https://commons.wikimedia.org/wiki/File:Mehndi_Macro.jpg",
    },
  },
  {
    title: "Haldi Mornings",
    description:
      "Marigolds, turmeric and a sunlit setting made for laughter, blessings and a little happy mess.",
    caption: "A little sunshine. A lot of love.",
    icon: Sun,
    image: haldi,
    alt: "A bride in yellow laughing as family members apply turmeric paste at her haldi",
    credit: {
      author: "The open draft",
      license: "CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File:Haldi_Ceremony_-_An_Indian_Wedding_Ritual.jpg",
    },
  },
  {
    title: "Sangeet Nights",
    description:
      "A stage, a great sound system and rehearsed surprises, so every side of the family gets its moment.",
    caption: "One more song. Always.",
    icon: Music2,
    image: sangeet,
    alt: "Musicians performing on a floral wedding stage at a sangeet night",
    credit: {
      author: "03Ani03",
      license: "CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File:Indian_wedding_sangeet.jpg",
    },
  },
  {
    title: "Florals & Decor",
    description:
      "Marigold arches, flowing drapes and fresh blooms, styled to the colours of your story.",
    caption: "Your vision, in full bloom.",
    icon: Flower2,
    image: florals,
    alt: "A garden wedding arch with yellow drapes surrounded by marigolds and flowers",
    credit: {
      author: "Megh Banthia",
      license: "CC BY-SA 4.0",
      url: "https://commons.wikimedia.org/wiki/File:Sustainable_flower_decoration.jpg",
    },
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
              src={item.image}
              alt={active === i ? item.alt : ""}
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
            href={current.credit.url}
            target="_blank"
            rel="noreferrer"
          >
            Photo: {current.credit.author} · {current.credit.license}
          </a>
        </div>
      </div>
    </section>
  );
}
