import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flower2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteLinks } from "./site-links";

// `hidden` keeps the header out of sight (and out of the tab order) during the Home reveal.
export function SiteHeader({ hidden = false }: { hidden?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header" data-hidden={hidden}>
        <Link to="/" className="brand" aria-label="EventVerse home">
          <Flower2 className="brand-flower" strokeWidth={1.25} />
          <span className="brand-word">eventverse</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          {siteLinks.map((link) => (
            <Link key={link.to} to={link.to} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </nav>
        <div className="scroll-progress" />
      </header>
      {menuOpen && !hidden && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          {siteLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
