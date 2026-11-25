import { z } from "zod";

export const ShiftSchema = z.object({
  id: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  position: z.enum(["WAITER", "RUNNER", "HEAD_WAITER"]),
  status: z.enum(["OPEN", "ASSIGNED", "COMPLETED"]),
  assignedTo: z.number().int().positive().optional(),
});

export type Shift = z.infer<typeof ShiftSchema>;

export const NewShiftSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  position: z.enum(["WAITER", "RUNNER", "HEAD_WAITER"]),
});
