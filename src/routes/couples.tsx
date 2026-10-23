import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { OutcomeSection } from "@/components/site/outcome-section";
import { photos, type Photo } from "@/components/wedding/photos";
import { useWeddingDemo } from "@/components/wedding/use-wedding-demo";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";
import mandap from "@/assets/floral-mandap.jpg";
import baraat from "@/assets/baraat-celebration.jpg";

export const Route = createFileRoute("/couples")({
  head: () => ({
    meta: [
      { title: "For Couples — EventVerse" },
      {
        name: "description",
        content:
          "See the weddings actually happening around you. Real ceremonies. Real vendors. Verified, not sponsored.",
      },
      { property: "og:title", content: "For Couples — EventVerse" },
      {
        property: "og:description",
        content: "Real ceremonies. Real vendors. Verified, not sponsored.",
      },
    ],
  }),
  component: Couples,
});

// Placeholder photography until real covered weddings are published to the feed.
const feed: { place: string; photo: Photo }[] = [
  {
    place: "Udaipur, this weekend.",
    photo: { src: mandap, alt: "A floral mandap with flowing drapes and candlelit seating" },
  },
  { place: "Jaipur, Saturday morning.", photo: photos.haldi },
  { place: "Delhi, Friday night.", photo: photos.sangeet },
  { place: "Lucknow, this afternoon.", photo: photos.mehndi },
  {
    place: "Jodhpur, last Sunday.",
    photo: { src: baraat, alt: "A joyful baraat with musicians and wedding guests" },
  },
  { place: "Goa, last weekend.", photo: photos.florals },
];
const essentials = [
  {
    title: "A marketplace with nothing to hide.",
    body: "Real pricing. Real portfolios. No preferred-vendor payola.",
  },
  {
    title: "Moodboards that become plans.",
    body: "Collect what you love — we turn it into a working wedding.",
  },
  {
    title: "Planning, with an edge.",
    body: "AI that understands your budget, your city, your families — not a generic checklist.",
  },
  {
    title: "Every function, planned properly.",
    body: "Roka, sangeet, mehendi, haldi, baraat, pheras, vidai — each one its own event with its own guest list and vendors, held together as one wedding instead of eleven separate plans.",
  },
  {
    title: "Guidance for the rituals that matter.",
    body: "Regional, accurate, never generic.",
  },
  {
    title: "Invitations, built in.",
    body: "Design, send, track RSVPs — without a separate app.",
  },
  {
    title: "Plan together, properly.",
    body: "Shared access for family — no more five WhatsApp groups with five versions of the truth.",
  },
  {
    title: "One thread for everyone.",
    body: "You, your planner, your vendors — on WhatsApp, where you already are.",
  },
];

function Couples() {
  const pageRef = useRevealOnScroll<HTMLDivElement>();
  const { openDemo, dialog } = useWeddingDemo();
  return (
    <div ref={pageRef}>
      <SiteHeader />
      <main id="main">
        <section className="page-hero">
          <span className="eyebrow" data-reveal>
            For Couples
          </span>
          <h1 data-reveal>
            See the weddings actually happening around you.
            <span>Real ceremonies. Real vendors. Verified, not sponsored.</span>
          </h1>
        </section>

        <section className="page-section page-section-tight" aria-label="Weddings happening now">
          <div className="wedding-feed">
            {feed.map((item) => (
              <figure key={item.place} className="feed-card" data-reveal>
                <img
                  src={item.photo.src}
                  alt={item.photo.alt}
                  loading="lazy"
                  width={600}
                  height={750}
                />
                <figcaption>
                  <strong>{item.place}</strong>
                  <span>
                    Covered by EventVerse. <BadgeCheck aria-hidden /> Verified.
                  </span>
                  {item.photo.credit && (
                    <a href={item.photo.credit.url} target="_blank" rel="noreferrer">
                      Photo: {item.photo.credit.author} · {item.photo.credit.license}
                    </a>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <OutcomeSection
          id="essentials"
          title="Everything You Need, Nothing You Don't"
          items={essentials}
        />

        <section className="page-cta">
          <Button
            variant="ghost"
            className="quiet-cta"
            data-reveal
            onClick={() => openDemo("couple")}
          >
            Start your wedding, properly <ArrowRight />
          </Button>
        </section>
      </main>
      <SiteFooter />
      {dialog}
    </div>
  );
}
