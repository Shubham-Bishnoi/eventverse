import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, Check, CheckCheck, MapPin, Flower2, Heart, CalendarDays, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { saveWeddingPlan } from '@/lib/wedding-plans.functions';
import type { WeddingPlan } from '@/lib/wedding-plan-schema';

export type Capability = { id: string; token: string };
export function DemoDialog({ open, onOpenChange, plan, setPlan, capability, onSaved }: {
  open: boolean; onOpenChange: (value: boolean) => void; plan: WeddingPlan;
  setPlan: (plan: WeddingPlan) => void; capability?: Capability | undefined; onSaved: (capability: Capability) => void;
}) {
  const save = useServerFn(saveWeddingPlan);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [error, setError] = useState('');
  const tasks = ['Choose your venue', 'Find your wedding team', 'Send the invitations', 'Plan the rituals', 'Choose your wedding looks', 'Confirm the final details'];
  async function handleSave() {
    setStatus('saving'); setError('');
    try {
      const result = await save({ data: { plan, capability } });
      onSaved(result); setStatus('saved');
    } catch (e) { setError(e instanceof Error ? e.message : 'Please try again.'); setStatus('idle'); }
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="demo-dialog">
      <DialogHeader><span className="eyebrow">YOUR EVENTVERSE</span><DialogTitle className="demo-title">A beautiful beginning.</DialogTitle><DialogDescription>Your wedding, coming together.</DialogDescription></DialogHeader>
      <div className="audience-switch" aria-label="Planning as">
        <Button variant={plan.audience === 'couple' ? 'wedding' : 'ghost'} onClick={() => { setPlan({ ...plan, audience: 'couple' }); setStatus('idle'); }}>For couples</Button>
        <Button variant={plan.audience === 'planner' ? 'wedding' : 'ghost'} onClick={() => { setPlan({ ...plan, audience: 'planner' }); setStatus('idle'); }}>For planners</Button>
      </div>
      <div className="plan-summary">
        <div><MapPin /><span>Destination<strong>{plan.venue}</strong></span></div>
        <div><Flower2 /><span>Wedding mood<strong>{plan.vibe}</strong></span></div>
        <div><CalendarDays /><span>Celebration<strong>{plan.ritual}</strong></span></div>
        <div><Heart /><span>Wedding look<strong>{plan.outfit_saved ? 'Shortlisted' : 'Still dreaming'}</strong></span></div>
      </div>
      <div className="demo-task-heading"><strong>{plan.audience === 'couple' ? 'Your wedding checklist' : 'Your event checklist'}</strong><span>{plan.tasks.filter(Boolean).length} / 6</span></div>
      <div className="demo-tasks">{tasks.map((task, i) => <label key={task}><input type="checkbox" checked={plan.tasks[i]} onChange={() => { setPlan({ ...plan, tasks: plan.tasks.map((value, n) => n === i ? !value : value) }); setStatus('idle'); }} /><span>{task}</span>{plan.tasks[i] && <Check size={14} />}</label>)}</div>
      {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
      <Button variant="wedding" size="lg" onClick={handleSave} disabled={status === 'saving'}>{status === 'saved' ? <><CheckCheck /> Plan saved</> : status === 'saving' ? <><Cloud /> Saving your plan…</> : <>Save my wedding plan <ArrowRight /></>}</Button>
      {status === 'saved' && <p role="status" className="save-note">Your choices are saved. Welcome to your Eventverse.</p>}
    </DialogContent>
  </Dialog>;
}