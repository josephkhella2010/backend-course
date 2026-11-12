
import "dotenv/config";
import express from "express";

const app = express();
const PORT = process.env.PORT || 3006;

// Fix issue 1: Do not disclose Express version information
app.disable("x-powered-by");

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

// Fix issue 2: Use a compare function for numeric sorting
app.get("/numbers/sorted", (req, res) => {
  const numbers = [30, 5, 100, 2];
  const sortedNumbers = numbers.sort((a, b) => a - b);

  res.json(sortedNumbers);
});

// Fix issue 3: Include an initial value in reduce()
app.get("/numbers/total", (req, res) => {
  const numbers = [10, 20, 30];
  const total = numbers.reduce(
    (sum, number) => sum + number,
    0
  );

  res.json({ total });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
