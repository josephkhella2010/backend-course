import request from "supertest";
import { createBookingsApp } from "../src/bookings";
import { BookingSchema } from "../validation/bookingsSchema";
import type { Express } from "express";

describe("Bookings API", () => {
  let app: Express;

  beforeEach(() => {
    app = createBookingsApp();
  });

  const newBooking = {
    guestName: "Sara Svensson",
    partySize: 3,
    date: "2027-01-10",
    time: "19:00",
    tableId: 3,
  };

  // M1 - Creating and reading bookings

  test("GET all bookings returns the three initial bookings", async () => {
    const response = await request(app).get("/api/bookings");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);

    response.body.forEach((booking: unknown) => {
      expect(BookingSchema.safeParse(booking).success).toBe(true);
    });
  });

  test("GET booking by ID returns the correct booking", async () => {
    const response = await request(app).get("/api/bookings/1");

    expect(response.status).toBe(200);
    expect(response.body.guestName).toBe("Andersson");
    expect(response.body.partySize).toBe(4);
    expect(response.body.tableId).toBe(2);
  });

  test("GET unknown booking returns 404", async () => {
    const response = await request(app).get("/api/bookings/99");

    expect(response.status).toBe(404);
  });

  test("POST creates a booking", async () => {
    const response = await request(app).post("/api/bookings").send(newBooking);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(4);
    expect(response.body.status).toBe("CONFIRMED");
    expect(BookingSchema.safeParse(response.body).success).toBe(true);
  });

  test.each([0, 1, 8, 9])(
    "Party size %i is validated correctly",
    async (partySize) => {
      const response = await request(app)
        .post("/api/bookings")
        .send({ ...newBooking, partySize });

      if (partySize === 1 || partySize === 8) {
        expect(response.status).toBe(201);
      } else {
        expect(response.status).toBe(400);
      }
    },
  );

  test.each([0, 1, 5, 6])(
    "Table ID %i is validated correctly",
    async (tableId) => {
      const response = await request(app)
        .post("/api/bookings")
        .send({ ...newBooking, tableId });

      if (tableId >= 1 && tableId <= 5) {
        expect(response.status).toBe(201);
      } else {
        expect(response.status).toBe(400);
      }
    },
  );

  test.each(["2026-13-40", "24/12/2026", "2026-02-30"])(
    "Invalid date %s returns 400",
    async (date) => {
      const response = await request(app)
        .post("/api/bookings")
        .send({ ...newBooking, date });

      expect(response.status).toBe(400);
      expect(response.body.issues.date).toBeDefined();
    },
  );

  test("Invalid time returns 400", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ ...newBooking, time: "18:00" });

    expect(response.status).toBe(400);
  });

  test("Missing guest name returns 400", async () => {
    const response = await request(app)
      .post("/api/bookings")
      .send({ ...newBooking, guestName: "   " });

    expect(response.status).toBe(400);
    expect(response.body.issues.guestName).toBeDefined();
  });

  test("GET date filter returns only bookings for that date", async () => {
    const response = await request(app).get("/api/bookings?date=2026-12-24");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(
      response.body.every((booking: any) => booking.date === "2026-12-24"),
    ).toBe(true);
  });

  // M2 - Double bookings and cancellation

  test("Cannot book a table that is already occupied", async () => {
    const response = await request(app).post("/api/bookings").send({
      guestName: "Test Guest",
      partySize: 2,
      date: "2026-12-24",
      time: "19:00",
      tableId: 2,
    });

    expect(response.status).toBe(409);
  });

  test("Same table can be booked at a different time", async () => {
    const response = await request(app).post("/api/bookings").send({
      guestName: "Test Guest",
      partySize: 2,
      date: "2026-12-24",
      time: "21:00",
      tableId: 2,
    });

    expect(response.status).toBe(201);
  });

  test("A cancelled booking slot can be booked again", async () => {
    const response = await request(app).post("/api/bookings").send({
      guestName: "New Guest",
      partySize: 2,
      date: "2026-12-31",
      time: "21:00",
      tableId: 5,
    });

    expect(response.status).toBe(201);
  });

  test("Cancelling a booking frees its table slot", async () => {
    const cancelled = await request(app).post("/api/bookings/1/cancel");

    expect(cancelled.status).toBe(200);
    expect(cancelled.body.status).toBe("CANCELLED");

    const newResponse = await request(app).post("/api/bookings").send({
      guestName: "New Guest",
      partySize: 3,
      date: "2026-12-24",
      time: "19:00",
      tableId: 2,
    });

    expect(newResponse.status).toBe(201);
  });

  test("Cancelling the same booking twice returns 409", async () => {
    await request(app).post("/api/bookings/1/cancel");

    const response = await request(app).post("/api/bookings/1/cancel");

    expect(response.status).toBe(409);
  });

  test("Cancelling an unknown booking returns 404", async () => {
    const response = await request(app).post("/api/bookings/99/cancel");

    expect(response.status).toBe(404);
  });

  // M3 - Updating bookings

  test("PATCH changes party size and keeps other fields", async () => {
    const response = await request(app)
      .patch("/api/bookings/1")
      .send({ partySize: 5 });

    expect(response.status).toBe(200);
    expect(response.body.partySize).toBe(5);
    expect(response.body.guestName).toBe("Andersson");
    expect(response.body.date).toBe("2026-12-24");
    expect(response.body.time).toBe("19:00");
    expect(response.body.tableId).toBe(2);
    expect(response.body.status).toBe("CONFIRMED");

    const getResponse = await request(app).get("/api/bookings/1");

    expect(getResponse.body.partySize).toBe(5);
  });

  test("PATCH can change time and table", async () => {
    const response = await request(app).patch("/api/bookings/1").send({
      time: "21:00",
      tableId: 3,
    });

    expect(response.status).toBe(200);
    expect(response.body.time).toBe("21:00");
    expect(response.body.tableId).toBe(3);
  });

  test("Moving a booking into an occupied slot returns 409", async () => {
    const response = await request(app).patch("/api/bookings/1").send({
      time: "17:00",
      tableId: 1,
    });

    expect(response.status).toBe(409);

    const getResponse = await request(app).get("/api/bookings/1");

    expect(getResponse.body.time).toBe("19:00");
    expect(getResponse.body.tableId).toBe(2);
  });

  test("Updating only party size does not conflict with itself", async () => {
    const response = await request(app)
      .patch("/api/bookings/1")
      .send({ partySize: 6 });

    expect(response.status).toBe(200);
    expect(response.body.partySize).toBe(6);
  });

  test("Empty PATCH body returns 400", async () => {
    const response = await request(app).patch("/api/bookings/1").send({});

    expect(response.status).toBe(400);
  });

  test("Invalid party size returns 400", async () => {
    const response = await request(app)
      .patch("/api/bookings/1")
      .send({ partySize: 20 });

    expect(response.status).toBe(400);
  });

  test("PATCH ignores guestName", async () => {
    const response = await request(app).patch("/api/bookings/1").send({
      guestName: "Changed Name",
      partySize: 5,
    });

    expect(response.status).toBe(200);
    expect(response.body.guestName).toBe("Andersson");
    expect(response.body.partySize).toBe(5);
  });

  test("Cancelled booking cannot be changed", async () => {
    const response = await request(app)
      .patch("/api/bookings/3")
      .send({ partySize: 4 });

    expect(response.status).toBe(409);
  });

  test("Updating an unknown booking returns 404", async () => {
    const response = await request(app)
      .patch("/api/bookings/99")
      .send({ partySize: 4 });

    expect(response.status).toBe(404);
  });
});
