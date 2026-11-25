import { z } from "zod";

export const BookingSchema = z.object({
  id: z.number(),
  guestName: z.string().min(1),
  partySize: z.number().int().min(1).max(8),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.enum(["17:00", "19:00", "21:00"]),
  tableId: z.number().int().min(1).max(5),
  status: z.enum(["CONFIRMED", "CANCELLED"]),
});

export type Booking = z.infer<typeof BookingSchema>;

export const NewBookingSchema = z.object({
  guestName: z.string().trim().min(1),
  partySize: z.number().int().min(1).max(8),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.enum(["17:00", "19:00", "21:00"]),
  tableId: z.number().int().min(1).max(5),
});

export const UpdateBookingSchema = z
  .object({
    partySize: z.number().int().min(1).max(8).optional(),
    time: z.enum(["17:00", "19:00", "21:00"]).optional(),
    tableId: z.number().int().min(1).max(5).optional(),
  })
  .strict();
