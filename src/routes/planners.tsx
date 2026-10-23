import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { OutcomeSection } from "@/components/site/outcome-section";
import { useWeddingDemo } from "@/components/wedding/use-wedding-demo";
import { useRevealOnScroll } from "@/hooks/use-reveal-on-scroll";

export const Route = createFileRoute("/planners")({
  head: () => ({
    meta: [
      { title: "For Planners — EventVerse" },
      {
        name: "description",
        content:
          "Every other platform sells you a listing. EventVerse gives wedding planners a verified record that can't be faked.",
      },
      { property: "og:title", content: "For Planners — EventVerse" },
      {
        property: "og:description",
        content:
          "Every other platform sells you a listing. We give you a record that can't be faked.",
      },
    ],
  }),
  component: Planners,
});

const ledger = [
  "Complete a wedding.",
  "The couple confirms it.",
  "We verify and cover the wedding.",
  "It's sealed to your profile — permanently, publicly, provably yours.",
];
const operations = [
  {
    title: "Inventory, always current.",
    body: "Know what's booked, what's free, what's at risk — before a client asks.",
  },
  {
    title: "See your team, live.",
    body: "Who's on-site, who's on the way, who's behind — without a single phone call.",
  },
  {
    title: "Never double-book again.",
    body: "One calendar. Every vendor, every venue, every date — reconciled automatically.",
  },
  {
    title: "Built on WhatsApp.",
    body: "Your team already lives there. Now your clients and vendors do too — one thread, fully tracked, nothing lost to a chat that got deleted.",
  },
];
const planning = [
  {
    title: "A planner that already knows the job.",
    body: "Budgets, vendor availability, timelines, regional rituals — reconciled automatically, not typed in twice.",
  },
  {
    title: "Draft a wedding in minutes, not meetings.",
    body: "Give it the brief — city, budget, family size, date. It returns a working plan, not a template.",
  },
  {
    title: "It flags what you'd have caught too late.",
    body: "Vendor conflicts, budget drift, a timeline that doesn't actually fit the day — surfaced before they become a client's problem.",
  },
  {
    title: "Built for the Indian wedding, not a generic one.",
    body: "Roka to vidai — every function planned as its own event, with its own vendors, guest list, and rituals, reconciled into one timeline. Nothing templated, nothing Western-default.",
  },
];

function Planners() {
  const pageRef = useRevealOnScroll<HTMLDivElement>();
  const { openDemo, dialog } = useWeddingDemo();
  return (
    <div ref={pageRef}>
      <SiteHeader />
      <main id="main">
        <section className="page-hero">
          <span className="eyebrow" data-reveal>
            For Planners
          </span>
          <h1 data-reveal>
            Every other platform sells you a listing.
            <span>We give you a record that can't be faked.</span>
          </h1>
        </section>

        <section className="page-section page-section-dark" aria-labelledby="verified">
          <div className="page-inner">
            <h2 id="verified" className="section-kicker" data-reveal>
              Verified Visibility
            </h2>
            <ol className="ledger">
              {ledger.map((step, i) => (
                <li key={step} data-reveal>
                  <span className="ledger-number">0{i + 1}</span>
                  <span className="ledger-text">{step}</span>
                </li>
              ))}
            </ol>
            <p className="section-statement" data-reveal>
              The more weddings you complete, the harder you are to compete with.
            </p>
          </div>
        </section>

        <OutcomeSection
          id="operations"
          title="Run the Business, Not the Chaos"
          items={operations}
        />
        <OutcomeSection id="edge" title="Planning, With an Edge" items={planning} />

        <section className="page-cta">
          <Button
            variant="ghost"
            className="quiet-cta"
            data-reveal
            onClick={() => openDemo("planner")}
          >
            Bring your agency aboard <ArrowRight />
          </Button>
        </section>
      </main>
      <SiteFooter />
      {dialog}
    </div>
  );
}
