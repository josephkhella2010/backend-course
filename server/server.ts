import express from "express";
import { z } from "zod";

const app = express();

app.use(express.json());

const PORT = 3302;

// 1- Skill 1: Minimal Server & Ping

app.get("/ping", (req, res) => {
  try {
    return res.status(200).json({ message: "pong" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Skill 2: Fetch a Random Person
const RandomUserSchema = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),

      location: z.object({
        country: z.string(),
      }),

      email: z.string(),

      login: z.object({
        username: z.string(),
      }),

      dob: z.object({
        date: z.string(),
        age: z.number(),
      }),
    }),
  ),
});

app.get("/random-person", async (req, res) => {
  const response = await fetch("https://randomuser.me/api/");
  const data = await response.json();
  const validationResults = RandomUserSchema.safeParse(data);

  try {
    if (!validationResults.success) {
      return res.status(400).json({ message: "error while get person" });
    }
    const person = validationResults.data.results[0];
    return res.status(200).json({
      message: "successfully get person",
      fullName: `${person.name.first} ${person.name.last}`,
      country: person.location.country,
      person,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Skill 3: User Signup Route (POST)

const userSchema = z.object({
  name: z.string().min(3).max(12),

  age: z
    .number()
    .min(18, { message: "User must be at least 18 years old" })
    .max(100, { message: "User must be at most 100 years old" })
    .optional()
    .default(28),

  email: z.email().transform((email) => email.toLowerCase()),
});
app.post("/users", async (req, res) => {
  try {
    const validationUser = userSchema.safeParse(req.body);

    if (!validationUser.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationUser.error.issues,
      });
    }
    return res.status(201).json({
      message: "successfully add user",
      user: validationUser.data,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
});

// Skill 4 Challenge (Optional)

const RandomUserSchemaTwo = z.object({
  results: z.array(
    z.object({
      name: z.object({
        first: z.string(),
        last: z.string(),
      }),

      location: z.object({
        country: z.string(),
      }),

      email: z.string(),

      login: z.object({
        username: z.string(),
      }),

      dob: z.object({
        date: z.string(),
        age: z.number(),
      }),

      registered: z.object({
        date: z.string(),
      }),
    }),
  ),
});

app.get("/random-login", async (req, res) => {
  try {
    const response = await fetch("https://randomuser.me/api/");

    const data = await response.json();

    const validationResults = RandomUserSchemaTwo.safeParse(data);

    if (!validationResults.success) {
      return res.status(500).json({
        message: "Invalid data received from Random User API",
      });
    }

    const person = validationResults.data.results[0];

    const username = person.login.username;

    const registeredDate = person.registered.date.split("T")[0];

    return res.status(200).json({
      username,
      registeredDate,
      summary: `${username} (registered on ${registeredDate})`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

//
app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
