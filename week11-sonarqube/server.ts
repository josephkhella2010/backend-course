import "dotenv/config";
import express from "express";

const app = express();

// Fix 1: Disable Express version disclosure
app.disable("x-powered-by");

const PORT = process.env.PORT || 3006;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Week 11 SonarQube server is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
  });
});

// Example 2: Use loose equality instead of strict equality
app.get("/example-equality", (req, res) => {
  const userRole = "admin";

  if (userRole == "admin") {
    res.send("Administrator");
  } else {
    res.send("Regular user");
  }
});

// Example 3: Hardcoded password
app.get("/example-password", (req, res) => {
  const password = "admin123";

  res.json({ message: "Example endpoint created" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
