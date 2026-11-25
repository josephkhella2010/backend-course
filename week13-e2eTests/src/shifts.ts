import express, { Request, Response, NextFunction } from "express";
import { Shift, NewShiftSchema } from "../validation/shiftsSchema";

type Role = "ADMIN" | "STAFF";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: Role;
  };
}

export function createShiftsApp() {
  const app = express();
  app.use(express.json());

  const shifts: Shift[] = [
    {
      id: 1,
      date: "2026-12-24",
      start: "16:00",
      end: "23:00",
      position: "WAITER",
      status: "OPEN",
    },
    {
      id: 2,
      date: "2026-12-24",
      start: "16:00",
      end: "23:00",
      position: "RUNNER",
      status: "ASSIGNED",
      assignedTo: 2,
    },
    {
      id: 3,
      date: "2026-12-24",
      start: "11:00",
      end: "16:00",
      position: "HEAD_WAITER",
      status: "OPEN",
    },
    {
      id: 4,
      date: "2026-12-25",
      start: "12:00",
      end: "20:00",
      position: "WAITER",
      status: "OPEN",
    },
    {
      id: 5,
      date: "2026-12-25",
      start: "12:00",
      end: "20:00",
      position: "RUNNER",
      status: "COMPLETED",
    },
    {
      id: 6,
      date: "2026-12-31",
      start: "17:00",
      end: "23:59",
      position: "WAITER",
      status: "OPEN",
    },
    {
      id: 7,
      date: "2026-12-31",
      start: "17:00",
      end: "23:59",
      position: "RUNNER",
      status: "OPEN",
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

  function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    const role = req.headers["x-role"];
    const userId = req.headers["x-user-id"];

    if (
      (role !== "ADMIN" && role !== "STAFF") ||
      typeof userId !== "string" ||
      !/^[1-9]\d*$/.test(userId)
    ) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    req.user = {
      id: Number(userId),
      role,
    };

    next();
  }

  function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  }

  // GET all shifts with filtering and pagination
  app.get("/api/shifts", authenticate, (req: AuthRequest, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 5));

    let filteredShifts = [...shifts];

    const status = req.query.status;

    if (status !== undefined) {
      if (
        status !== "OPEN" &&
        status !== "ASSIGNED" &&
        status !== "COMPLETED"
      ) {
        return res.status(400).json({
          message: "Invalid status",
        });
      }

      filteredShifts = filteredShifts.filter(
        (shift) => shift.status === status,
      );
    }

    const startIndex = (page - 1) * limit;
    const data = filteredShifts.slice(startIndex, startIndex + limit);

    return res.status(200).json({
      data,
      page,
      limit,
      total: filteredShifts.length,
    });
  });

  // GET one shift
  app.get(
    "/api/shifts/:id",
    authenticate,
    (req: AuthRequest, res: Response) => {
      const id = Number(req.params.id);
      const shift = shifts.find((item) => item.id === id);

      if (!shift) {
        return res.status(404).json({
          message: "Shift not found",
        });
      }

      return res.status(200).json(shift);
    },
  );

  // ADMIN creates a shift
  app.post(
    "/api/shifts",
    authenticate,
    requireAdmin,
    (req: AuthRequest, res: Response) => {
      const result = NewShiftSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          issues: result.error.flatten().fieldErrors,
        });
      }

      const { date, start, end, position } = result.data;

      if (!isRealDate(date)) {
        return res.status(400).json({
          issues: {
            date: ["Date must be a real calendar date"],
          },
        });
      }

      if (end <= start) {
        return res.status(400).json({
          issues: {
            end: ["End time must be after start time"],
          },
        });
      }

      const newShift: Shift = {
        id: Math.max(0, ...shifts.map((shift) => shift.id)) + 1,
        date,
        start,
        end,
        position,
        status: "OPEN",
      };

      shifts.push(newShift);

      return res.status(201).json(newShift);
    },
  );

  // STAFF claims an open shift
  app.post(
    "/api/shifts/:id/claim",
    authenticate,
    (req: AuthRequest, res: Response) => {
      if (req.user?.role !== "STAFF") {
        return res.status(403).json({
          message: "Staff access required",
        });
      }

      const id = Number(req.params.id);
      const shift = shifts.find((item) => item.id === id);

      if (!shift) {
        return res.status(404).json({
          message: "Shift not found",
        });
      }

      if (shift.status !== "OPEN") {
        return res.status(409).json({
          message: "Shift is not open",
        });
      }

      const alreadyHasShift = shifts.some(
        (item) =>
          item.date === shift.date &&
          item.status === "ASSIGNED" &&
          item.assignedTo === req.user!.id,
      );

      if (alreadyHasShift) {
        return res.status(409).json({
          message: "Staff member already has a shift on this date",
        });
      }

      shift.status = "ASSIGNED";
      shift.assignedTo = req.user.id;

      return res.status(200).json(shift);
    },
  );

  // ADMIN completes an assigned shift
  app.post(
    "/api/shifts/:id/complete",
    authenticate,
    requireAdmin,
    (req: AuthRequest, res: Response) => {
      const id = Number(req.params.id);
      const shift = shifts.find((item) => item.id === id);

      if (!shift) {
        return res.status(404).json({
          message: "Shift not found",
        });
      }

      if (shift.status !== "ASSIGNED") {
        return res.status(409).json({
          message: "Only assigned shifts can be completed",
        });
      }

      shift.status = "COMPLETED";

      return res.status(200).json(shift);
    },
  );

  // ADMIN deletes an open shift
  app.delete(
    "/api/shifts/:id",
    authenticate,
    requireAdmin,
    (req: AuthRequest, res: Response) => {
      const id = Number(req.params.id);
      const shiftIndex = shifts.findIndex((item) => item.id === id);

      if (shiftIndex === -1) {
        return res.status(404).json({
          message: "Shift not found",
        });
      }

      if (shifts[shiftIndex].status !== "OPEN") {
        return res.status(409).json({
          message: "Only open shifts can be deleted",
        });
      }

      shifts.splice(shiftIndex, 1);

      return res.status(204).send();
    },
  );

  return app;
}

export default createShiftsApp;
