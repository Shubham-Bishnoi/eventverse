import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — EventVerse" },
      { name: "description", content: "EventVerse resources. Coming soon." },
    ],
  }),
  component: Resources,
});

// Intentionally minimal until the section is scoped: the bare statement, nothing more.
function Resources() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="page-placeholder">
        <h1>
          Resources
          <span>Coming soon.</span>
        </h1>
      </main>
      <SiteFooter />
    </>
  );
}
