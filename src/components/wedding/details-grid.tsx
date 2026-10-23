import { useState, type ReactNode } from "react";
import { ArrowRight, Check, Flower2, Gem, Heart, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WeddingPlan } from "@/lib/wedding-plan-schema";
import { venues } from "./journey-data";
import wedding from "@/assets/wedding-universe.jpg";
import mandap from "@/assets/floral-mandap.jpg";

// Invitations, venue, decor and styling as one bento grid of tiles: title and label at the
// bottom, a soft dim and slow zoom on hover. Any tile's media can be a photo or a looping video.
type Media = { kind: "image"; src: string; alt: string } | { kind: "video"; src: string; poster?: string };

const vibes = ["Royal", "Dreamy", "Minimal", "Vibrant"] as const;
const looks = [
  { label: "Lehengas", line: "A little tradition. A little you. Find the wedding look you will love forever." },
  { label: "Jewellery", line: "Heirloom details and pieces that make every moment shine." },
  { label: "Makeup", line: "A fresh glow, a favourite lip, a look that feels entirely you." },
  { label: "Groom wear", line: "Timeless sherwanis and thoughtful details for his big moment." },
];
const people = ["Family", "Close friends", "College friends", "Colleagues", "Neighbours"];

function TileMedia({ media, className }: { media: Media; className?: string }) {
  return media.kind === "video" ? (
    <video className={`tile-media ${className ?? ""}`} src={media.src} poster={media.poster} autoPlay muted loop playsInline />
  ) : (
    <img className={`tile-media ${className ?? ""}`} src={media.src} alt={media.alt} loading="lazy" />
  );
}

function Caption({ title, label, line }: { title: ReactNode; label: string; line?: string }) {
  return (
    <div className="tile-caption">
      <h3>{title}</h3>
      <span className="tile-label">{label}</span>
      {line && <p>{line}</p>}
    </div>
  );
}

export function DetailsGrid({
  plan,
  setPlan,
  openDemo,
}: {
  plan: WeddingPlan;
  setPlan: (plan: WeddingPlan) => void;
  openDemo: () => void;
}) {
  const [guests, setGuests] = useState([true, true, true, false, false]);
  const [look, setLook] = useState(0);
  const venue = venues.find((v) => v.name === plan.venue) ?? venues[0];
  const invited = guests.filter(Boolean).length * 49 + 100;

  return (
    <section id="details" className="details-section" data-scene aria-labelledby="details-title">
      <header className="details-heading">
        <span className="eyebrow">EVERY DETAIL</span>
        <h2 id="details-title">Every detail, in place.</h2>
      </header>
      <div className="details-grid">
        <article className="tile tile-invite">
          <div className="invitation-paper">
            <Flower2 className="invite-flower" strokeWidth={1} />
            <small>TOGETHER WITH THEIR FAMILIES</small>
            <h4>
              Shanaya
              <br />
              <span>&</span>
              <br />
              Arjun
            </h4>
            <small>INVITE YOU TO CELEBRATE THEIR LOVE</small>
            <div className="invite-seal">
              <Heart size={15} strokeWidth={1} />
            </div>
            <p>12 DECEMBER 2026 · UDAIPUR</p>
            <small>TOGETHER, ALWAYS.</small>
          </div>
          <Caption
            title={
              <>
                Good things begin
                <br />
                with an invitation.
              </>
            }
            label="01 · THE INVITATIONS"
            line="Your favourite people. A little anticipation. An invitation that feels like you."
          />
          <Button variant="paper" className="tile-cta" onClick={openDemo}>
            Bring your people together <ArrowRight />
          </Button>
        </article>

        <article className="tile tile-venue tile-photo">
          <TileMedia
            key={venue.name}
            media={{ kind: "image", src: venue.image, alt: `${venue.name} wedding destination inspiration with palace architecture and flowers` }}
            className="image-crossfade"
          />
          <div className="tile-controls" role="tablist" aria-label="Wedding destinations">
            {venues.map((v) => (
              <button
                key={v.name}
                role="tab"
                aria-selected={plan.venue === v.name}
                className="tile-chip"
                onClick={() => setPlan({ ...plan, venue: v.name })}
              >
                {v.name}
              </button>
            ))}
          </div>
          <Caption
            title={
              <>
                A place for
                <br />
                your forever.
              </>
            }
            label={`02 · THE VENUE · ${venue.category}`}
            line={`${venue.title}. ${venue.description}`}
          />
          <Button
            variant="paper"
            className="tile-cta"
            onClick={() => {
              setPlan({ ...plan, tasks: plan.tasks.map((v, i) => (i === 0 ? true : v)) });
              openDemo();
            }}
          >
            Save this destination <Heart />
          </Button>
        </article>

        <article className="tile tile-people">
          <h3>Your people</h3>
          <div className="people-list">
            {people.map((name, i) => (
              <label key={name}>
                <input
                  type="checkbox"
                  checked={guests[i]}
                  onChange={() => setGuests(guests.map((v, j) => (i === j ? !v : v)))}
                />
                {name}
              </label>
            ))}
          </div>
          <div className="people-count">
            <span className="tile-label">LOVE, ON ITS WAY</span>
            <strong>
              {invited} <span>/ 350 invited</span>
            </strong>
            <div className="invite-meter">
              <i style={{ width: `${(invited / 350) * 100}%` }} />
            </div>
          </div>
          <p className="tile-note">
            <Mail /> Little invitations. Lifelong memories.
          </p>
        </article>

        <article className="tile tile-decor tile-photo" data-vibe={plan.vibe}>
          <TileMedia media={{ kind: "image", src: mandap, alt: "A floral mandap with flowing drapes and candlelit palace seating" }} />
          <div className="tile-controls tile-vibes" role="tablist" aria-label="Every love has a different colour.">
            {vibes.map((vibe) => (
              <button
                key={vibe}
                role="tab"
                aria-selected={plan.vibe === vibe}
                className="tile-chip"
                onClick={() => setPlan({ ...plan, vibe })}
              >
                <span className={`vibe-swatch vibe-${vibe.toLowerCase()}`} />
                {vibe}
              </button>
            ))}
          </div>
          <Caption
            title={
              <>
                Your vision.
                <br />
                In full bloom.
              </>
            }
            label="03 · DESIGN & DECOR"
            line="The colours. The flowers. The feeling. Bring the day you've imagined to life."
          />
          <Button variant="paper" className="tile-cta" onClick={openDemo}>
            Create your wedding mood <Sparkles />
          </Button>
        </article>

        <article className="tile tile-style tile-photo">
          <TileMedia media={{ kind: "image", src: wedding, alt: "A bride in an embroidered burgundy lehenga and groom in an ivory sherwani" }} />
          <div className="tile-controls" role="tablist" aria-label="Wedding styling categories">
            {looks.map((l, i) => (
              <button key={l.label} role="tab" aria-selected={look === i} className="tile-chip" onClick={() => setLook(i)}>
                {l.label}
              </button>
            ))}
          </div>
          <Caption
            title={
              <>
                A moment.
                <br />
                A look. Entirely you.
              </>
            }
            label="04 · OUTFITS & STYLING"
            line={looks[look]?.line}
          />
          <Button
            variant="paper"
            className="tile-cta"
            onClick={() => setPlan({ ...plan, outfit_saved: !plan.outfit_saved })}
          >
            {plan.outfit_saved ? (
              <>
                Added to your wishlist <Check />
              </>
            ) : (
              <>
                Save to my wishlist <Heart />
              </>
            )}
          </Button>
        </article>

        <article className="tile tile-quote">
          <Gem strokeWidth={1.2} />
          <p>
            Something timeless.
            <span>Something yours.</span>
          </p>
        </article>
      </div>
    </section>
  );
}
