import request from "supertest";
import { createShiftsApp } from "../src/shifts";
import { ShiftSchema } from "../validation/shiftsSchema";
import type { Express } from "express";

describe("Shifts API", () => {
  let app: Express;

  beforeEach(() => {
    app = createShiftsApp();
  });

  const admin = {
    "x-role": "ADMIN",
    "x-user-id": "1",
  };

  const staff = {
    "x-role": "STAFF",
    "x-user-id": "3",
  };

  const newShift = {
    date: "2027-01-10",
    start: "08:00",
    end: "16:00",
    position: "WAITER",
  };

  // H1 - Authentication and permissions

  test("Request without authentication returns 401", async () => {
    const response = await request(app).get("/api/shifts");
    expect(response.status).toBe(401);
  });

  test.each([
    { "x-role": "CHEF", "x-user-id": "1" },
    { "x-role": "ADMIN" },
    { "x-role": "ADMIN", "x-user-id": "abc" },
    { "x-role": "ADMIN", "x-user-id": "0" },
  ])("Invalid authentication headers return 401", async (headers) => {
    const response = await request(app).get("/api/shifts").set(headers);

    expect(response.status).toBe(401);
  });

  test("Authentication is checked before shift existence", async () => {
    const response = await request(app).get("/api/shifts/99");
    expect(response.status).toBe(401);
  });

  test.each([admin, staff])(
    "Authenticated user can view shifts",
    async (headers) => {
      const response = await request(app).get("/api/shifts").set(headers);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.total).toBe(7);

      response.body.data.forEach((shift: unknown) => {
        expect(ShiftSchema.safeParse(shift).success).toBe(true);
      });
    },
  );

  test.each([admin, staff])(
    "Authenticated user can view one shift",
    async (headers) => {
      const response = await request(app).get("/api/shifts/1").set(headers);

      expect(response.status).toBe(200);
      expect(ShiftSchema.safeParse(response.body).success).toBe(true);
    },
  );

  test("STAFF cannot create a shift", async () => {
    const response = await request(app)
      .post("/api/shifts")
      .set(staff)
      .send(newShift);

    expect(response.status).toBe(403);
  });

  test("ADMIN can create a shift", async () => {
    const response = await request(app)
      .post("/api/shifts")
      .set(admin)
      .send(newShift);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(8);
    expect(response.body.status).toBe("OPEN");
    expect(ShiftSchema.safeParse(response.body).success).toBe(true);
  });

  test("ADMIN cannot claim a shift", async () => {
    const response = await request(app).post("/api/shifts/1/claim").set(admin);

    expect(response.status).toBe(403);
  });

  test("STAFF cannot complete a shift", async () => {
    const response = await request(app)
      .post("/api/shifts/2/complete")
      .set(staff);

    expect(response.status).toBe(403);
  });

  test("STAFF cannot delete a shift", async () => {
    const response = await request(app).delete("/api/shifts/1").set(staff);

    expect(response.status).toBe(403);
  });

  // H2 - Shift lifecycle

  test("ADMIN creates, STAFF claims, ADMIN completes", async () => {
    const created = await request(app)
      .post("/api/shifts")
      .set(admin)
      .send(newShift);

    expect(created.status).toBe(201);
    expect(created.body.status).toBe("OPEN");

    const claimed = await request(app)
      .post(`/api/shifts/${created.body.id}/claim`)
      .set(staff);

    expect(claimed.status).toBe(200);
    expect(claimed.body.status).toBe("ASSIGNED");
    expect(claimed.body.assignedTo).toBe(3);

    const completed = await request(app)
      .post(`/api/shifts/${created.body.id}/complete`)
      .set(admin);

    expect(completed.status).toBe(200);
    expect(completed.body.status).toBe("COMPLETED");
    expect(completed.body.assignedTo).toBe(3);
    expect(ShiftSchema.safeParse(completed.body).success).toBe(true);
  });

  test("Only the first staff member can claim a shift", async () => {
    const first = await request(app)
      .post("/api/shifts/1/claim")
      .set({ "x-role": "STAFF", "x-user-id": "10" });

    const second = await request(app)
      .post("/api/shifts/1/claim")
      .set({ "x-role": "STAFF", "x-user-id": "11" });

    expect(first.status).toBe(200);
    expect(first.body.assignedTo).toBe(10);
    expect(second.status).toBe(409);
  });

  test("Staff cannot claim two shifts on the same date", async () => {
    const response = await request(app)
      .post("/api/shifts/1/claim")
      .set({ "x-role": "STAFF", "x-user-id": "2" });

    expect(response.status).toBe(409);
  });

  test("Staff can claim a shift on another date", async () => {
    const response = await request(app)
      .post("/api/shifts/4/claim")
      .set({ "x-role": "STAFF", "x-user-id": "2" });

    expect(response.status).toBe(200);
    expect(response.body.assignedTo).toBe(2);
  });

  test("Completing an OPEN shift returns 409", async () => {
    const response = await request(app)
      .post("/api/shifts/1/complete")
      .set(admin);

    expect(response.status).toBe(409);
  });

  test("Completing a COMPLETED shift returns 409", async () => {
    const response = await request(app)
      .post("/api/shifts/5/complete")
      .set(admin);

    expect(response.status).toBe(409);
  });

  test("Claiming a COMPLETED shift returns 409", async () => {
    const response = await request(app).post("/api/shifts/5/claim").set(staff);

    expect(response.status).toBe(409);
  });

  test("Deleting an ASSIGNED shift returns 409", async () => {
    const response = await request(app).delete("/api/shifts/2").set(admin);

    expect(response.status).toBe(409);
  });

  test("ADMIN can delete an OPEN shift", async () => {
    const deleted = await request(app).delete("/api/shifts/1").set(admin);

    expect(deleted.status).toBe(204);

    const response = await request(app).get("/api/shifts/1").set(admin);

    expect(response.status).toBe(404);
  });

  test("Claiming an unknown shift returns 404", async () => {
    const response = await request(app).post("/api/shifts/99/claim").set(staff);

    expect(response.status).toBe(404);
  });

  // H3 - Pagination, filtering and validation

  test("Page 1 returns shifts 1 to 5", async () => {
    const response = await request(app)
      .get("/api/shifts?page=1&limit=5")
      .set(admin);

    expect(response.status).toBe(200);
    expect(response.body.data.map((shift: any) => shift.id)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(response.body.page).toBe(1);
    expect(response.body.limit).toBe(5);
    expect(response.body.total).toBe(7);
  });

  test("Page 2 returns shifts 6 and 7", async () => {
    const response = await request(app)
      .get("/api/shifts?page=2&limit=5")
      .set(admin);

    expect(response.status).toBe(200);
    expect(response.body.data.map((shift: any) => shift.id)).toEqual([6, 7]);
    expect(response.body.total).toBe(7);
  });

  test("Default pagination uses limit 5", async () => {
    const response = await request(app).get("/api/shifts").set(admin);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.limit).toBe(5);
  });

  test("Maximum pagination limit is 20", async () => {
    const response = await request(app).get("/api/shifts?limit=50").set(admin);

    expect(response.status).toBe(200);
    expect(response.body.limit).toBe(20);
  });

  test("Status filter returns OPEN shifts", async () => {
    const response = await request(app)
      .get("/api/shifts?status=OPEN")
      .set(admin);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.total).toBe(5);
    expect(
      response.body.data.every((shift: any) => shift.status === "OPEN"),
    ).toBe(true);
  });

  test("Status filter returns ASSIGNED shifts", async () => {
    const response = await request(app)
      .get("/api/shifts?status=ASSIGNED")
      .set(admin);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.total).toBe(1);
  });

  test("Invalid status filter returns 400", async () => {
    const response = await request(app)
      .get("/api/shifts?status=INVALID")
      .set(admin);

    expect(response.status).toBe(400);
  });

  test("Creating a valid shift returns 201", async () => {
    const response = await request(app)
      .post("/api/shifts")
      .set(admin)
      .send(newShift);

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("OPEN");
  });

  test.each([
    { ...newShift, date: "2026-13-40" },
    { ...newShift, date: "10/01/2027" },
    { ...newShift, start: "25:00" },
    { ...newShift, end: "12:70" },
    { ...newShift, start: "16:00", end: "08:00" },
    { ...newShift, start: "08:00", end: "08:00" },
    { ...newShift, position: "CHEF" },
  ])("Invalid shift data returns 400", async (body) => {
    const response = await request(app)
      .post("/api/shifts")
      .set(admin)
      .send(body);

    expect(response.status).toBe(400);
  });

  test("Getting an unknown shift returns 404", async () => {
    const response = await request(app).get("/api/shifts/99").set(admin);

    expect(response.status).toBe(404);
  });
});
