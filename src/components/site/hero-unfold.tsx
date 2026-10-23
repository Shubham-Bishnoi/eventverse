import { useEffect, useRef, useState } from "react";
import { photos } from "@/components/wedding/photos";

// An "unfold" intro for the hero: the word rises, a curved strip of photos sweeps in and
// settles on the hero image, the strip narrows to that one card, and the card opens to fill
// the hero. It plays once, the first time the hero is scrolled into view from above.
// The parent hero gets data-unfold so its own copy can wait, then rise in.
const word = "EVENTVERSE";
const before = [
  photos.handInHand,
  photos.rings,
  photos.mehndi,
  photos.haldi,
  photos.sangeet,
  photos.florals,
];
const after = [photos.table, photos.bouquet];
type Phase = "off" | "armed" | "playing" | "done";

export function HeroUnfold({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("off");

  useEffect(() => {
    const hero = ref.current?.parentElement;
    if (!hero) return;
    hero.dataset["unfold"] = phase;
  }, [phase]);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.parentElement;
    if (!root || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only arm it while the hero is still below the fold, so nobody sees content vanish.
    if (hero.getBoundingClientRect().top < window.innerHeight * 0.5) return;
    setPhase("armed");
    let cancelled = false;

    const play = async () => {
      setPhase("playing");
      const letters = Array.from(root.querySelectorAll<HTMLElement>(".unfold-letter"));
      const strip = root.querySelector<HTMLElement>(".unfold-strip")!;
      const track = root.querySelector<HTMLElement>(".unfold-track")!;
      const card = track.children[before.length] as HTMLElement;
      const final = root.querySelector<HTMLElement>(".unfold-final")!;
      const settle = "cubic-bezier(.16, 1, .3, 1)";
      const fill = "both" as const;

      letters.forEach((l, i) =>
        l.animate([{ transform: "translateY(110%)" }, { transform: "none" }], {
          duration: 700,
          delay: i * 45,
          easing: settle,
          fill,
        }),
      );
      const width = strip.clientWidth;
      const shift = width / 2 - (card.offsetLeft + card.offsetWidth / 2);
      await track.animate(
        [{ transform: `translateX(${width}px)` }, { transform: `translateX(${shift}px)` }],
        {
          duration: 1450,
          delay: 300,
          easing: settle,
          fill,
        },
      ).finished;
      if (cancelled) return;

      letters.forEach((l, i) =>
        l.animate([{ transform: "none" }, { transform: "translateY(120%) rotate(10deg)" }], {
          duration: 520,
          delay: i * 35,
          easing: "cubic-bezier(.5, 0, .75, 0)",
          fill,
        }),
      );
      const inset = (width - card.offsetWidth) / 2;
      const narrow = `inset(0px ${inset}px 0px ${inset}px)`;
      await strip.animate([{ clipPath: "inset(0px 0px 0px 0px)" }, { clipPath: narrow }], {
        duration: 560,
        easing: "cubic-bezier(.65, 0, .35, 1)",
        fill,
      }).finished;
      if (cancelled) return;

      // The full hero image takes over the card's window, then the window opens.
      final.style.clipPath = narrow;
      await final.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill }).finished;
      if (cancelled) return;
      strip.style.visibility = "hidden";
      const band = `100% ${(strip.offsetHeight / root.offsetHeight) * 100}%`;
      await final.animate(
        [
          { clipPath: narrow, maskSize: band, webkitMaskSize: band },
          {
            clipPath: "inset(0px 0px 0px 0px)",
            maskSize: "100% 320%",
            webkitMaskSize: "100% 320%",
          },
        ],
        { duration: 950, easing: "cubic-bezier(.7, 0, .2, 1)", fill },
      ).finished;
      if (cancelled) return;
      await root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, fill }).finished;
      if (!cancelled) setPhase("done");
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        // Arriving from below (or by jump) skips the intro rather than replaying it out of order.
        if (entry.boundingClientRect.top < 0) setPhase("off");
        else void play();
      },
      { threshold: 0.55 },
    );
    observer.observe(hero);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const skip = () => {
    ref.current?.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    setPhase("done");
  };

  // Always the same element, so the running sequence keeps hold of it; lazy images inside a
  // hidden overlay are never fetched when the intro is skipped.
  return (
    <div
      ref={ref}
      className="hero-unfold"
      hidden={phase === "off" || phase === "done"}
      aria-hidden
      onClick={skip}
    >
      <div className="unfold-word">
        {word.split("").map((letter, i) => (
          <span key={i} className="unfold-letter">
            {letter}
          </span>
        ))}
      </div>
      <div className="unfold-strip">
        <div className="unfold-track">
          {[...before, { src: image }, ...after].map((photo, i) => (
            <img key={i} src={photo.src} alt="" className="unfold-card" loading="lazy" />
          ))}
        </div>
      </div>
      <img src={image} alt="" className="unfold-final" loading="lazy" />
    </div>
  );
}
