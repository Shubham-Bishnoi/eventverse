import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowDown, ArrowRight, Heart, Flower2, Sparkles, MapPin, Camera, Utensils, Music2, Plus, Check, Users, Mail, CalendarDays, Wallet, ListChecks, Menu, X, Leaf, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DemoDialog, type Capability } from '@/components/wedding/demo-dialog';
import { chapters, venues, rituals } from '@/components/wedding/journey-data';
import { loadWeddingPlan } from '@/lib/wedding-plans.functions';
import type { WeddingPlan } from '@/lib/wedding-plan-schema';

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
const initialPlan: WeddingPlan = { audience: 'couple', venue: 'Udaipur', vibe: 'Dreamy', ritual: 'Mehndi', outfit_saved: false, tasks: [true, true, false, false, false, false] };
const vendors = [ { name: 'Photography', note: 'Every fleeting moment.', icon: Camera }, { name: 'Catering', note: 'A celebration of flavour.', icon: Utensils }, { name: 'Decor', note: 'Your dream, in bloom.', icon: Flower2 }, { name: 'Entertainment', note: 'One more song, always.', icon: Music2 } ];
const styleLabels = ['Lehengas', 'Jewellery', 'Makeup', 'Groom wear'];
const styleDescriptions = ['A little tradition. A little you. Find the wedding look you will love forever.', 'Heirloom details and pieces that make every moment shine.', 'A fresh glow, a favourite lip, a look that feels entirely you.', 'Timeless sherwanis and thoughtful details for his big moment.'];
function Index() {
  const [active, setActive] = useState(0);
  const [plan, setPlan] = useState<WeddingPlan>(initialPlan);
  const [capability, setCapability] = useState<Capability>();
  const [demoOpen, setDemoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guests, setGuests] = useState([true, true, true, false, false]);
  const [style, setStyle] = useState(0);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  const loadPlan = useServerFn(loadWeddingPlan);
  const selectedVenue = venues.find(v => v.name === plan.venue) ?? venues[0];
  const selectedRitual = rituals.find(r => r.name === plan.ritual) ?? rituals[0];

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = sessionStorage.getItem('eventverse-plan-capability');
      if (raw) {
        const stored: Capability = JSON.parse(raw);
        loadPlan({ data: stored }).then(saved => { if (!cancelled) { setPlan(saved); setCapability(stored); } }).catch(() => sessionStorage.removeItem('eventverse-plan-capability'));
      }
    } catch { /* Storage may be disabled; the live demo remains usable. */ }
    return () => { cancelled = true; };
  }, [loadPlan]);

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
  function goTo(id: string) { document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); setMenuOpen(false); }
  function openDemo(audience: 'couple' | 'planner' = 'couple') { setPlan(p => ({ ...p, audience })); setDemoOpen(true); setMenuOpen(false); }
  function onSaved(value: Capability) { setCapability(value); try { sessionStorage.setItem('eventverse-plan-capability', JSON.stringify(value)); } catch { /* Persistence is still stored in Cloud. */ } }
  const chapterLabel = (n: number, text: string) => <span className="eyebrow"><span className="chapter-number">0{n}</span>{text}</span>;

  return <div ref={pageRef}>
    <a href="#universe" className="skip-link">Skip to wedding demo</a>
    <header className="site-header">
      <a href="#beginning" className="brand" aria-label="Eventverse home"><Flower2 className="brand-flower" strokeWidth={1.25} /><span className="brand-word">eventverse</span></a>
      <nav className="site-nav" aria-label="Main navigation">
        <Button variant="ghost" className="nav-link" onClick={() => openDemo('couple')}>For couples</Button>
        <Button variant="ghost" className="nav-link" onClick={() => openDemo('planner')}>For planners</Button>
        <Button variant="ghost" className="nav-link" onClick={() => goTo('universe')}>Our universe</Button>
        <Button variant="wedding" className="header-cta" onClick={() => openDemo()}>Try the demo <ArrowRight size={13} /></Button>
        <Button variant="ghost" size="icon" className="mobile-menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button>
      </nav>
      <div className="scroll-progress" />
    </header>
    {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation"><Button variant="ghost" onClick={() => openDemo('couple')}>For couples</Button><Button variant="ghost" onClick={() => openDemo('planner')}>For planners</Button><Button variant="ghost" onClick={() => goTo('rituals')}>The rituals</Button><Button variant="ghost" onClick={() => goTo('universe')}>Our universe</Button></nav>}
    <nav className="chapter-rail" aria-label="Wedding journey chapters">{chapters.map((chapter, i) => <Button key={chapter.id} variant="ghost" className="rail-button" data-active={active === i} aria-label={chapter.label} aria-current={active === i ? 'step' : undefined} onClick={() => goTo(chapter.id)}><span className="rail-label">{chapter.label}</span><span className="rail-dot" /></Button>)}</nav>
    <main>
      <section id="beginning" className="hero" data-scene>
        <img src={chapters[0].image} alt="An Indian bride and groom holding varmala garlands in a flower-filled palace courtyard" className="hero-image" width={1920} height={1088} fetchPriority="high" />
        <div className="hero-content"><span className="eyebrow">ONE WEDDING. A THOUSAND POSSIBILITIES.</span><h1>Your wedding.<span>One beautiful universe.</span></h1><p>From the first invitation to the final happy tear.<br />Every little detail. Beautifully together.</p><Button variant="ghost" className="begin-button" onClick={() => goTo('invitations')}>Scroll to begin <ArrowDown size={14} /></Button></div>
        <div className="hero-bottom"><span>Your forever starts here.</span><div className="hero-line" /></div>
        <div className="hero-note">MADE FOR YOUR BIG DAY <span>AND EVERYTHING BEFORE IT</span></div>
      </section>
      <div className="welcome-band"><div><h2>A celebration. Not a checklist.</h2><p>Welcome to Eventverse. Let's make it yours.</p></div><div className="welcome-chapters"><div><span>01 — DREAM</span><strong>Imagine your day</strong></div><div><span>02 — BRING IT TOGETHER</span><strong>Every detail, in place</strong></div><div><span>03 — CELEBRATE</span><strong>Be in the moment</strong></div></div><Button variant="ghost" size="icon" aria-label="Continue to invitations" onClick={() => goTo('invitations')}><ArrowDown /></Button></div>
      <section id="invitations" className="journey-scene invite-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[1].image} alt="" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(1, 'THE INVITATIONS')}<h2>Good things begin<br />with an invitation.</h2><p>Your favourite people. A little anticipation. An invitation that feels like you.</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Bring your people together <ArrowRight /></Button></div>
        <div className="invitation-composition"><div className="invitation-paper"><Flower2 className="invite-flower" strokeWidth={1} /><small>TOGETHER WITH THEIR FAMILIES</small><h3>Ananya<br /><span>&</span><br />Arjun</h3><small>INVITE YOU TO CELEBRATE THEIR LOVE</small><div className="invite-seal"><Heart size={15} strokeWidth={1} /></div><p>12 DECEMBER 2026 · UDAIPUR</p><small>TOGETHER, ALWAYS.</small></div><div className="guest-paper"><h4>Your people</h4>{['Family', 'Close friends', 'College friends', 'Colleagues', 'Neighbours'].map((name, i) => <label key={name}><input type="checkbox" checked={guests[i]} onChange={() => setGuests(guests.map((v, j) => i === j ? !v : v))} />{name}</label>)}</div><div className="invite-counter"><span>LOVE, ON ITS WAY</span><strong>{guests.filter(Boolean).length * 49 + 100} <span className="inline!">/ 350 invited</span></strong><div className="invite-meter"><i /></div></div></div>
        <div className="scene-footnote"><Mail /> Little invitations. Lifelong memories.</div>
      </div></section>
      <section id="venue" className="journey-scene venue-scene" data-scene><div className="scene-stage">
        <img key={selectedVenue.name} className="scene-image image-crossfade" src={selectedVenue.image} alt={`${selectedVenue.name} wedding destination inspiration with palace architecture and flowers`} loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(2, 'THE VENUE')}<h2>A place for<br />your forever.</h2><p>Royal palaces. Sunlit gardens. A dream by the water. Find the setting for your story.</p><Button variant="paper" className="scene-cta" onClick={() => { setPlan({ ...plan, tasks: plan.tasks.map((v, i) => i === 0 ? true : v) }); openDemo(); }}>Save this destination <Heart /></Button></div>
        <div className="scene-tabs" role="tablist" aria-label="Wedding destinations">{venues.map(venue => <Button key={venue.name} variant="ghost" role="tab" aria-selected={plan.venue === venue.name} className="venue-option" data-active={plan.venue === venue.name} onClick={() => setPlan({ ...plan, venue: venue.name })}><img src={venue.image} alt="" loading="lazy" width={100} height={70} /><span>{venue.name}</span></Button>)}</div>
        <div className="venue-caption" role="tabpanel"><span className="eyebrow">{selectedVenue.category}</span><h3>{selectedVenue.title}</h3><p>{selectedVenue.description}</p></div>
      </div></section>
      <section id="decor" className="journey-scene decor-scene" data-vibe={plan.vibe} data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[3].image} alt="A floral mandap with flowing drapes and candlelit palace seating" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(3, 'DESIGN & DECOR')}<h2>Your vision.<br />In full bloom.</h2><p>The colours. The flowers. The feeling. Bring the day you've imagined to life.</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Create your wedding mood <Sparkles /></Button></div>
        <div className="vibe-panel"><p>Every love has a different colour.</p><div className="vibe-options" role="tablist" aria-label="Wedding decor mood">{(['Royal', 'Dreamy', 'Minimal', 'Vibrant'] as const).map(vibe => <Button variant="ghost" role="tab" aria-selected={vibe === plan.vibe} data-active={vibe === plan.vibe} className="vibe-button" key={vibe} onClick={() => setPlan({ ...plan, vibe })}><span className={`vibe-swatch vibe-${vibe.toLowerCase()}`} /><span>{vibe}</span></Button>)}</div></div>
      </div></section>
      <section id="style" className="journey-scene style-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[4].image} alt="A bride in an embroidered burgundy lehenga and groom in an ivory sherwani" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(4, 'OUTFITS & STYLING')}<h2>A moment.<br />A look. Entirely you.</h2><p>{styleDescriptions[style]}</p><div className="style-options" role="tablist" aria-label="Wedding styling categories">{styleLabels.map((label, i) => <Button variant="chapter" role="tab" aria-selected={style === i} data-active={style === i} className="style-option" key={label} onClick={() => setStyle(i)}>{label}</Button>)}</div><Button variant="paper" className="scene-cta" onClick={() => setPlan({ ...plan, outfit_saved: !plan.outfit_saved })}>{plan.outfit_saved ? <>Added to your wishlist <Check /></> : <>Save to my wishlist <Heart /></>}</Button></div>
        <div className="scene-footnote"><Gem /> Something timeless. Something yours.</div>
      </div></section>
      <section id="team" className="journey-scene team-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[5].image} alt="A joyful celebration with musicians and wedding guests" loading="lazy" width={1920} height={1088} />
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
        <img className="scene-image" src={chapters[7].image} alt="A floral wedding mandap ready for a sacred Indian marriage ceremony" loading="lazy" width={1920} height={1088} />
        <div className="scene-copy">{chapterLabel(7, 'THE BIG DAY')}<h2>Be in the moment.<br />We'll hold the details.</h2><p>The happy tears. The tight hugs. The promises. This day is yours to enjoy.</p><Button variant="paper" className="scene-cta" onClick={() => openDemo()}>Bring it all together <ArrowRight /></Button></div>
        <div className="wedding-checklist"><h3>Everything, beautifully in place.</h3><div><Check /> Your venue. Your people.</div><div><Check /> Every celebration, on time.</div><div><Check /> A thousand little details.</div><div><Heart /> One unforgettable wedding.</div></div>
      </div></section>
      <section id="universe" className="journey-scene universe-scene" data-scene><div className="scene-stage">
        <img className="scene-image" src={chapters[8].image} alt="" loading="lazy" width={1920} height={1088} />
        <div className="universe-intro"><span className="eyebrow">WELCOME TO YOUR EVENTVERSE</span><h2>One wedding.<br />A thousand moving pieces.<br />Beautifully, together.</h2><p>From the first idea to the final goodbye.<br />Your entire wedding. One universe.</p></div>
        <div className="universe-nodes">{[{ icon: Mail, label: 'Invitations' }, { icon: Users, label: 'Guests' }, { icon: MapPin, label: 'Venues' }, { icon: Flower2, label: 'Decor' }, { icon: Camera, label: 'Vendors' }, { icon: Wallet, label: 'Budget' }, { icon: ListChecks, label: 'Tasks' }, { icon: CalendarDays, label: 'Timelines' }, { icon: Heart, label: 'Rituals' }].map(node => <span key={node.label}><node.icon strokeWidth={1} />{node.label}</span>)}</div>
        <div className="path-options"><article className="path-option"><h3>I'm planning my wedding.</h3><p>Dream together. Plan together. Celebrate together. Make every step feel like you.</p><Button variant="wedding" className="path-cta" onClick={() => openDemo('couple')}>Enter your Eventverse <ArrowRight /></Button></article><article className="path-option"><h3>I make weddings happen.</h3><p>Your clients, your team, every beautiful detail. Bring all your celebrations into one place.</p><Button variant="paper" className="path-cta" onClick={() => openDemo('planner')}>Explore Eventverse for planners <ArrowRight /></Button></article></div>
      </div></section>
    </main>
    <footer className="site-footer"><a href="#beginning" className="brand"><Flower2 className="brand-flower" strokeWidth={1.2} /><span className="brand-word">eventverse</span></a><p>Bigger celebrations. A little less chaos. Beautifully together.</p><span>WITH LOVE, IN INDIA <Leaf size={10} className="inline ml-1" /></span></footer>
    <DemoDialog open={demoOpen} onOpenChange={setDemoOpen} plan={plan} setPlan={setPlan} capability={capability} onSaved={onSaved} />
  </div>;
}
