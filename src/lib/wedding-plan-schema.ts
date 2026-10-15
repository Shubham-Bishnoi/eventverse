import { z } from 'zod';

export const planSchema = z.object({
  audience: z.enum(['couple', 'planner']),
  venue: z.enum(['Udaipur', 'Jaipur', 'Goa', 'Delhi NCR']),
  vibe: z.enum(['Royal', 'Dreamy', 'Minimal', 'Vibrant']),
  ritual: z.enum(['Mehndi', 'Haldi', 'Sangeet', 'Baraat', 'Varmala', 'Pheras', 'Vidaai']),
  outfit_saved: z.boolean(),
  tasks: z.array(z.boolean()).length(6),
});
export type WeddingPlan = z.infer<typeof planSchema>;
export const capabilitySchema = z.object({ id: z.string().uuid(), token: z.string().uuid() });
export const savePlanSchema = z.object({ plan: planSchema, capability: capabilitySchema.optional() });