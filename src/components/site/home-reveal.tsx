import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { SilkBackground } from "./silk-background";

const beats = [
  { lead: "Weddings in India are about to be", line: "remembered differently." },
  { lead: "Not another marketplace.", line: "A record. A system. A standard." },
  { lead: "EventVerse", line: "Step aboard." },
] as const;

// The one moment of pure reveal on the site: type only, no navigation, one beat per screen.
// `onPassedChange` reports when the visitor has scrolled through it, so the header can appear.
export function HomeReveal({ onPassedChange }: { onPassedChange: (passed: boolean) => void }) {
  const ref = useRef<HTMLElement>(null);
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const section = ref.current;
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setBeat(Math.min(beats.length - 1, Math.floor(progress * beats.length)));
      onPassedChange(rect.bottom <= window.innerHeight * 0.5);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [onPassedChange]);

  return (
    <section ref={ref} className="home-reveal" aria-label="EventVerse">
      <div className="reveal-stage">
        <SilkBackground />
        {beats.map((b, i) => (
          <p
            key={b.lead}
            className="reveal-beat"
            data-final={i === beats.length - 1}
            data-active={i === beat}
          >
            <span>{b.lead}</span>
            <span>{b.line}</span>
          </p>
        ))}
        <span className="reveal-hint" data-active={beat === 0} aria-hidden>
          Scroll <ArrowDown size={12} />
        </span>
      </div>
    </section>
  );
}
