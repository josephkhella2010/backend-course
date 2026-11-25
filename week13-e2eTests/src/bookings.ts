import express, { Request, Response } from "express";
import {
  Booking,
  NewBookingSchema,
  UpdateBookingSchema,
} from "../validation/bookingsSchema";

export function createBookingsApp() {
  const app = express();
  app.use(express.json());

  const bookings: Booking[] = [
    {
      id: 1,
      guestName: "Andersson",
      partySize: 4,
      date: "2026-12-24",
      time: "19:00",
      tableId: 2,
      status: "CONFIRMED",
    },
    {
      id: 2,
      guestName: "Lind",
      partySize: 2,
      date: "2026-12-24",
      time: "17:00",
      tableId: 1,
      status: "CONFIRMED",
    },
    {
      id: 3,
      guestName: "Nilsson",
      partySize: 6,
      date: "2026-12-31",
      time: "21:00",
      tableId: 5,
      status: "CANCELLED",
    },
  ];

  function isRealDate(date: string): boolean {
    const parts = date.split("-");

    if (parts.length !== 3) return false;

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    return (
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day
    );
  }

  function hasConflict(
    date: string,
    time: string,
    tableId: number,
    ignoreId?: number,
  ): boolean {
    return bookings.some(
      (booking) =>
        booking.id !== ignoreId &&
        booking.date === date &&
        booking.time === time &&
        booking.tableId === tableId &&
        booking.status === "CONFIRMED",
    );
  }

  // GET bookings, optionally filtered by date
  app.get("/api/bookings", (req: Request, res: Response) => {
    const date = req.query.date;

    if (date !== undefined) {
      if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !isRealDate(date)
      ) {
        return res.status(400).json({
          issues: {
            date: ["Date must be a valid YYYY-MM-DD date"],
          },
        });
      }

      const filteredBookings = bookings.filter(
        (booking) => booking.date === date,
      );

      return res.status(200).json(filteredBookings);
    }

    return res.status(200).json(bookings);
  });

  // GET one booking
  app.get("/api/bookings/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    return res.status(200).json(booking);
  });

  // POST a new booking
  app.post("/api/bookings", (req: Request, res: Response) => {
    const result = NewBookingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        issues: result.error.flatten().fieldErrors,
      });
    }

    const { guestName, partySize, date, time, tableId } = result.data;

    if (!isRealDate(date)) {
      return res.status(400).json({
        issues: {
          date: ["Date must be a real calendar date"],
        },
      });
    }

    if (hasConflict(date, time, tableId)) {
      return res.status(409).json({
        message: "This table is already booked at this date and time",
      });
    }

    const newBooking: Booking = {
      id: Math.max(0, ...bookings.map((booking) => booking.id)) + 1,
      guestName,
      partySize,
      date,
      time,
      tableId,
      status: "CONFIRMED",
    };

    bookings.push(newBooking);

    return res.status(201).json(newBooking);
  });

  // PATCH booking details
  app.patch("/api/bookings/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(409).json({
        message: "Cancelled bookings cannot be changed",
      });
    }

    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        message: "Request body cannot be empty",
      });
    }

    // Only partySize, time and tableId may be changed.
    // Other fields, such as guestName, are ignored.
    const allowedFields = ["partySize", "time", "tableId"];

    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid booking fields provided",
      });
    }

    const result = UpdateBookingSchema.safeParse(updateData);

    if (!result.success) {
      return res.status(400).json({
        issues: result.error.flatten().fieldErrors,
      });
    }

    const updatedData = {
      ...booking,
      ...result.data,
    };

    if (
      hasConflict(
        booking.date,
        updatedData.time,
        updatedData.tableId,
        booking.id,
      )
    ) {
      return res.status(409).json({
        message: "This table is already booked at this date and time",
      });
    }

    Object.assign(booking, result.data);

    return res.status(200).json(booking);
  });

  // POST cancel booking
  app.post("/api/bookings/:id/cancel", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const booking = bookings.find((item) => item.id === id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.status === "CANCELLED") {
      return res.status(409).json({
        message: "Booking is already cancelled",
      });
    }

    booking.status = "CANCELLED";

    return res.status(200).json(booking);
  });

  return app;
}

export default createBookingsApp;
