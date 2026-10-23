import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Heart, Flower2, Sparkles, MapPin, Camera, Utensils, Music2, Plus, Check, Users, Mail, CalendarDays, Wallet, ListChecks, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { HomeReveal } from '@/components/site/home-reveal';
import { HeroUnfold } from '@/components/site/hero-unfold';
import { CelebrationSwitch } from '@/components/wedding/celebration-switch';
import { RibbonGallery } from '@/components/wedding/ribbon-gallery';
import { DetailsGrid } from '@/components/wedding/details-grid';
import { chapters, venues, rituals } from '@/components/wedding/journey-data';
import { useWeddingDemo } from '@/components/wedding/use-wedding-demo';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Eventverse — Your wedding. One beautiful universe.' },
    { name: 'description', content: 'Enter an illustrated Indian wedding journey. Discover invitations, dream venues, decor, baraat, varmala and every ritual, all in one Eventverse.' },
    { property: 'og:title', content: 'Eventverse — Your wedding. One beautiful universe.' },
    { property: 'og:description', content: 'From the first invitation to the final happy tear. A scroll-led Indian wedding universe for couples and planners.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
const vendors = [ { name: 'Photography', note: 'Every fleeting moment.', icon: Camera }, { name: 'Catering', note: 'A celebration of flavour.', icon: Utensils }, { name: 'Decor', note: 'Your dream, in bloom.', icon: Flower2 }, { name: 'Entertainment', note: 'One more song, always.', icon: Music2 } ];
function Index() {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const { plan, setPlan, openDemo, dialog } = useWeddingDemo();
  const [shortlist, setShortlist] = useState<string[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const selectedRitual = rituals.find(r => r.name === plan.ritual) ?? rituals[0];

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
    let raf = 0;
    const update = () => {
      const height = window.innerHeight;
      const total = document.documentElement.scrollHeight - height;
      root.style.setProperty('--page-progress', String(total > 0 ? window.scrollY / total : 0));
      let current = 0;
      scenes.forEach((scene, i) => {
        const rect = scene.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - height * .3)));
        scene.style.setProperty('--scene-progress', String(progress));
        if (rect.top <= height * .48) current = i;
      });
      setActive(current); raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf); };
  }, []);
  function goTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  const chapterLabel = (n: number, text: string) => <span className="eyebrow"><span className="chapter-number">0{n}</span>{text}</span>;

  return <div ref={pageRef}>
    <SiteHeader hidden={!revealed} />
    <nav className="chapter-rail" data-hidden={!revealed} aria-label="Wedding journey chapters">{chapters.map((chapter, i) => <Button key={chapter.id} variant="ghost" className="rail-button" data-active={active === i} aria-label={chapter.label} aria-current={active === i ? 'step' : undefined} onClick={() => goTo(chapter.id)}><span className="rail-label">{chapter.label}</span><span className="rail-dot" /></Button>)}</nav>
    <main id="main">
      <HomeReveal onPassedChange={setRevealed} />
      <section id="beginning" className="hero" data-scene>
        <img src={chapters[0].image} alt="An Indian bride and groom holding varmala garlands in a flower-filled palace courtyard" className="hero-image" width={1920} height={1088} fetchPriority="high" />
        <div className="hero-content"><span className="eyebrow">ONE WEDDING. A THOUSAND POSSIBILITIES.</span><h1>Your wedding.<span>One beautiful universe.</span></h1><p>From the first invitation to the final happy tear.<br />Every little detail. Beautifully together.</p><Button variant="ghost" className="begin-button" onClick={() => goTo('details')}>Scroll to begin <ArrowDown size={14} /></Button></div>
        <div className="hero-bottom"><span>Your forever starts here.</span><div className="hero-line" /></div>
        <div className="hero-note">MADE FOR YOUR BIG DAY <span>AND EVERYTHING BEFORE IT</span></div>
        <HeroUnfold image={chapters[0].image} />
      </section>
      <div className="welcome-band"><div><h2>A celebration. Not a checklist.</h2><p>Welcome to Eventverse. Let's make it yours.</p></div><div className="welcome-chapters"><div><span>01 — DREAM</span><strong>Imagine your day</strong></div><div><span>02 — BRING IT TOGETHER</span><strong>Every detail, in place</strong></div><div><span>03 — CELEBRATE</span><strong>Be in the moment</strong></div></div><Button variant="ghost" size="icon" aria-label="Continue to invitations" onClick={() => goTo('details')}><ArrowDown /></Button></div>
      <RibbonGallery />
      <CelebrationSwitch />
      <DetailsGrid plan={plan} setPlan={setPlan} openDemo={() => openDemo()} />
      <section id="team" className="journey-scene team-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[2].image} alt="A joyful celebration with musicians and wedding guests" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(5, 'YOUR WEDDING TEAM')}<h2>Great people.<br />Extraordinary days.</h2><p>The ones who bring it all together. Find the people who make your day feel effortless.</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Meet your dream team <ArrowRight /></Button></div>
        <div className="vendor-market">{vendors.map(vendor => <Button variant="ghost" className="vendor-card" key={vendor.name} aria-pressed={shortlist.includes(vendor.name)} onClick={() => setShortlist(shortlist.includes(vendor.name) ? shortlist.filter(n => n !== vendor.name) : [...shortlist, vendor.name])}><vendor.icon strokeWidth={1.2} /><strong>{vendor.name}</strong><span>{shortlist.includes(vendor.name) ? 'Added to your dream team' : vendor.note}</span>{shortlist.includes(vendor.name) ? <Check className="vendor-add" /> : <Plus className="vendor-add" />}</Button>)}</div>
        <div className="scene-footnote"><Users /> A little help. A whole lot of heart.</div>
      </div></section>
      <section id="rituals" className="journey-scene rituals-scene" data-scene><div className="scene-stage">
        <img key={selectedRitual.name} className="scene-image image-crossfade" src={selectedRitual.image} alt={`${selectedRitual.name} Indian wedding celebration inspiration`} loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(6, 'THE RITUALS')}<h2>{selectedRitual.title}</h2><p>{selectedRitual.description}</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Plan your celebrations <ArrowRight /></Button><span className="ritual-subtitle"><Flower2 size={14} strokeWidth={1} />{selectedRitual.time}</span></div>
        <div className="scene-tabs ritual-tabs" role="tablist" aria-label="Indian wedding rituals">{rituals.map(ritual => <Button key={ritual.name} variant="chapter" role="tab" aria-selected={plan.ritual === ritual.name} data-active={plan.ritual === ritual.name} className="ritual-tab" onClick={() => setPlan({ ...plan, ritual: ritual.name })}>{ritual.name}</Button>)}</div>
      </div></section>
      <section id="wedding" className="journey-scene wedding-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[4].image} alt="A floral wedding mandap ready for a sacred Indian marriage ceremony" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(7, 'THE BIG DAY')}<h2>Be in the moment.<br />We'll hold the details.</h2><p>The happy tears. The tight hugs. The promises. This day is yours to enjoy.</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Bring it all together <ArrowRight /></Button></div>
        <div className="wedding-checklist"><h3>Everything, beautifully in place.</h3><div><Check /> Your venue. Your people.</div><div><Check /> Every celebration, on time.</div><div><Check /> A thousand little details.</div><div><Heart /> One unforgettable wedding.</div></div>
      </div></section>
      <section id="universe" className="journey-scene universe-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[5].image} alt="" loading="lazy" width={1920} height={1088} />
        <div className="universe-intro"><span className="eyebrow">WELCOME TO YOUR EVENTVERSE</span><h2>One wedding.<br />A thousand moving pieces.<br />Beautifully, together.</h2><p>From the first idea to the final goodbye.<br />Your entire wedding. One universe.</p></div>
        <div className="universe-nodes">{[{ icon: Mail, label: 'Invitations' }, { icon: Users, label: 'Guests' }, { icon: MapPin, label: 'Venues' }, { icon: Flower2, label: 'Decor' }, { icon: Camera, label: 'Vendors' }, { icon: Wallet, label: 'Budget' }, { icon: ListChecks, label: 'Tasks' }, { icon: CalendarDays, label: 'Timelines' }, { icon: Heart, label: 'Rituals' }].map(node => <span key={node.label}><node.icon strokeWidth={1} />{node.label}</span>)}</div>
        <div className="path-options"><article className="path-option"><h3>I'm planning my wedding.</h3><p>Dream together. Plan together. Celebrate together. Make every step feel like you.</p><Button variant="wedding" className="path-cta" onClick={() => openDemo('couple')}>Enter your Eventverse <ArrowRight /></Button></article><article className="path-option"><h3>I make weddings happen.</h3><p>Your clients, your team, every beautiful detail. Bring all your celebrations into one place.</p><Button variant="paper" className="path-cta" onClick={() => openDemo('planner')}>Explore Eventverse for planners <ArrowRight /></Button></article></div>
      </div></section>
    </main>
    <SiteFooter />
    {dialog}
  </div>;
}
