import { createServerFn } from '@tanstack/react-start';
import { capabilitySchema, savePlanSchema, planSchema } from './wedding-plan-schema';

async function hashToken(token: string) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

export const saveWeddingPlan = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => savePlanSchema.parse(input))
  .handler(async ({ data }) => {
    const token = data.capability?.token ?? crypto.randomUUID();
    const accessHash = await hashToken(token);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    if (data.capability) {
      const { data: row, error } = await supabaseAdmin.from('wedding_demo_plans')
        .update({ ...data.plan, updated_at: new Date().toISOString() })
        .eq('id', data.capability.id).eq('access_hash', accessHash).select('id').single();
      if (error || !row) throw new Error('Unable to save this plan. Please start a new demo.');
      return { id: row.id, token };
    }
    const { data: row, error } = await supabaseAdmin.from('wedding_demo_plans')
      .insert({ ...data.plan, access_hash: accessHash }).select('id').single();
    if (error || !row) throw new Error('Your plan could not be saved. Please try again.');
    return { id: row.id, token };
  });

export const loadWeddingPlan = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => capabilitySchema.parse(input))
  .handler(async ({ data }) => {
    const hash = await hashToken(data.token);
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: row, error } = await supabaseAdmin.from('wedding_demo_plans')
      .select('audience,venue,vibe,ritual,outfit_saved,tasks').eq('id', data.id).eq('access_hash', hash).single();
    if (error || !row) throw new Error('This saved plan is unavailable.');
    return planSchema.parse(row);
  });