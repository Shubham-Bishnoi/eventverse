import { Link } from "@tanstack/react-router";
import { Flower2, Leaf } from "lucide-react";
import { siteLinks } from "./site-links";

// The closing bookend on every page: it mirrors the reveal and never restates a CTA.
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-line">
        Every wedding leaves a record.
        <span>Now it finally means something.</span>
      </p>
      <div className="footer-bar">
        <Link to="/" className="brand" aria-label="EventVerse home">
          <Flower2 className="brand-flower" strokeWidth={1.2} />
          <span className="brand-word">eventverse</span>
        </Link>
        <nav aria-label="Footer navigation">
          {siteLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>
        <span>
          WITH LOVE, IN INDIA <Leaf size={10} className="ml-1 inline" />
        </span>
      </div>
    </footer>
  );
}
