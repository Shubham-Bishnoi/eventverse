import { Link } from "@tanstack/react-router";
import { Flower2, Leaf } from "lucide-react";
import { FlowerMeadow } from "./flower-meadow";
import { siteLinks } from "./site-links";

// The closing bookend on every page: it mirrors the reveal and never restates a CTA.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand" aria-label="EventVerse home">
              <Flower2 className="brand-flower" strokeWidth={1.2} />
              <span className="brand-word">eventverse</span>
            </Link>
            <p className="footer-line">
              Every wedding leaves a record.
              <span>Now it finally means something.</span>
            </p>
            <small>
              © 2026 EventVerse · With love, in India <Leaf size={10} className="ml-1 inline" />
            </small>
          </div>
          <nav className="footer-links" aria-labelledby="footer-explore">
            <h2 id="footer-explore">Explore</h2>
            {siteLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <FlowerMeadow />
      </div>
    </footer>
  );
}
