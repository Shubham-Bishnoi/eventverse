import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { DemoDialog, type Capability } from "./demo-dialog";
import { loadWeddingPlan } from "@/lib/wedding-plans.functions";
import type { WeddingPlan } from "@/lib/wedding-plan-schema";

const initialPlan: WeddingPlan = {
  audience: "couple",
  venue: "Udaipur",
  vibe: "Dreamy",
  ritual: "Mehndi",
  outfit_saved: false,
  tasks: [true, true, false, false, false, false],
};
const storageKey = "eventverse-plan-capability";

// The demo plan and its dialog, shared by every page that offers "try it".
export function useWeddingDemo() {
  const [plan, setPlan] = useState<WeddingPlan>(initialPlan);
  const [capability, setCapability] = useState<Capability>();
  const [open, setOpen] = useState(false);
  const loadPlan = useServerFn(loadWeddingPlan);

  useEffect(() => {
    let cancelled = false;
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const stored: Capability = JSON.parse(raw);
        loadPlan({ data: stored })
          .then((saved) => {
            if (!cancelled) {
              setPlan(saved);
              setCapability(stored);
            }
          })
          .catch(() => sessionStorage.removeItem(storageKey));
      }
    } catch {
      /* Storage may be disabled; the live demo remains usable. */
    }
    return () => {
      cancelled = true;
    };
  }, [loadPlan]);

  function openDemo(audience: WeddingPlan["audience"] = "couple") {
    setPlan((p) => ({ ...p, audience }));
    setOpen(true);
  }
  function onSaved(value: Capability) {
    setCapability(value);
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* Persistence is still stored in Cloud. */
    }
  }

  const dialog = (
    <DemoDialog
      open={open}
      onOpenChange={setOpen}
      plan={plan}
      setPlan={setPlan}
      capability={capability}
      onSaved={onSaved}
    />
  );
  return { plan, setPlan, openDemo, dialog };
}
