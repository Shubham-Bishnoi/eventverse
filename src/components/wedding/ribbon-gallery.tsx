import { useEffect, useRef, useState } from "react";
import { photos, type Photo } from "./photos";

type Moment = { label: string; line: string; photo: Photo };
const moments = [
  { label: "The first touch", line: "One hand reaching for another.", photo: photos.firstTouch },
  { label: "Hand in hand", line: "Two people. One beautiful decision.", photo: photos.handInHand },
  { label: "The rings", line: "A small circle for a very big promise.", photo: photos.rings },
  { label: "The bouquet", line: "Wildflowers, gathered with love.", photo: photos.bouquet },
  {
    label: "Golden hour",
    line: "The light, the blooms, the butterflies.",
    photo: photos.goldenBouquet,
  },
  { label: "The table", line: "A long table for everyone you love.", photo: photos.table },
  {
    label: "A quiet moment",
    line: "Just the two of you, for a breath.",
    photo: photos.quietMoment,
  },
  { label: "Under the veil", line: "The whole world, a whisper away.", photo: photos.veil },
  {
    label: "Walking together",
    line: "The first steps of the rest of your life.",
    photo: photos.mistWalk,
  },
  { label: "Wherever you go", line: "Every road is better side by side.", photo: photos.hills },
  { label: "Sunset", line: "Some moments are meant to glow.", photo: photos.sunsetKiss },
  { label: "Forever", line: "And this is only the beginning.", photo: photos.beach },
] as const satisfies readonly Moment[];
// The ribbon travels right to left as the page scrolls down, so the story reads left to right.
const track = moments;

export function RibbonGallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [centered, setCentered] = useState(0);
  const moment: Moment = (moments as readonly Moment[])[centered] ?? moments[0];

  useEffect(() => {
    const section = sectionRef.current;
    const strip = trackRef.current;
    if (!section || !strip) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let distance = 0,
      stride = 1,
      target = 0,
      current = 0,
      raf = 0,
      last = -1;

    const read = () => {
      const progress = Math.min(
        1,
        Math.max(0, -section.getBoundingClientRect().top / Math.max(1, distance)),
      );
      target = -progress * distance;
    };
    const frame = () => {
      current =
        reduceMotion || Math.abs(target - current) < 0.5
          ? target
          : current + (target - current) * 0.14;
      strip.style.transform = `translate3d(${current}px, 0, 0)`;
      const index = Math.min(track.length - 1, Math.max(0, Math.round(-current / stride)));
      const next = index;
      if (next !== last) {
        last = next;
        setCentered(next);
      }
      raf = current === target ? 0 : requestAnimationFrame(frame);
    };
    const onScroll = () => {
      read();
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const measure = () => {
      const cards = strip.children;
      stride =
        cards.length > 1
          ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
          : 1;
      distance = Math.max(0, strip.scrollWidth - window.innerWidth);
      section.style.height = `${window.innerHeight + distance}px`;
      read();
      current = target;
      frame();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="ribbon-section" aria-label="The wedding, moment by moment">
      <div className="ribbon-stage">
        <img
          key={moment.label}
          className="ribbon-backdrop"
          src={moment.photo.src}
          alt=""
          aria-hidden
        />
        <div className="ribbon-heading">
          <span className="eyebrow">THE WHOLE CELEBRATION</span>
          <h2>
            From the first yes
            <br />
            to forever.
          </h2>
        </div>
        <span className="ribbon-count" aria-hidden>
          {String(centered + 1).padStart(2, "0")} / {moments.length}
        </span>
        <div className="ribbon-mask">
          <div ref={trackRef} className="ribbon-track">
            {track.map((item) => (
              <figure key={item.label} className="ribbon-card" data-active={item === moment}>
                <img
                  src={item.photo.src}
                  alt={item.photo.alt}
                  loading="lazy"
                  width={720}
                  height={900}
                />
              </figure>
            ))}
          </div>
        </div>
        <div className="ribbon-caption">
          <strong key={moment.label}>{moment.label}</strong>
          <p>{moment.line}</p>
          {moment.photo.credit && (
            <a href={moment.photo.credit.url} target="_blank" rel="noreferrer">
              Photo: {moment.photo.credit.author} · {moment.photo.credit.license}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
