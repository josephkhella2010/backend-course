import express from "express";

const app = express();

app.use(express.json());

const PORT = 3301;

// 1- Task 1: Homepage Route

app.get("/", (req, res) => {
  res.send("Welcome to our restaurant");
});

// 2-Task 2: Main Data Route

app.get("/menu", (req, res) => {
  res.status(200).json({
    title: "Menu of Restaurant",
    categories: ["breakfast", "lunch", "dinner"],
    lastUpdated: new Date().toISOString().split("T")[0],
  });
});

//Task 4: A Second JSON Route

app.get("/about", (req, res) => {
  res.json({
    description: "A friendly restaurant serving fresh and delicious food.",
    founded: 2020,
    funFact: "Our restaurant makes fresh meals every day.",
  });
});

// Task 5: Comparing Response Types

app.get("/welcome", (req, res) => {
  // res.send is a good choice here because we only want to
  // return a simple text message, not structured data.
  res.send("Welcome to our restaurant!");
});

// I would choose res.send over res.json for this route
// because the response is just a plain string. res.json
// is better when we want to return structured data such
// as an object or an array.
app.get("/contact", (req, res) => {
  res.send("Contact us at our restaurant for more information.");
});

// Task 6: Matching Status Codes to Scenarios

// If the route succeeds, Insomnia should show 200 OK.
// If the route does not exist, Insomnia should show 404 Not Found.
app.get("/", (req, res) => {
  res.send("Welcome to our restaurant");
});

// If the route succeeds, Insomnia should show 200 OK.
// If the route does not exist, Insomnia should show 404 Not Found.
app.get("/about", (req, res) => {
  res.status(200).json({
    title: "Menu of Restaurant",
    categories: ["breakfast", "lunch", "dinner"],
    lastUpdated: new Date().toISOString().split("T")[0],
  });
});

// If the route succeeds, Insomnia should show 200 OK.
// If the route does not exist, Insomnia should show 404 Not Found.
app.get("/contact", (req, res) => {
  res.send("Contact us at our restaurant for more information.");
});

// Task 7: Setting Status Codes Explicitly

app.get("/aboutTwo", (req, res) => {
  res.status(200).json({
    title: "Menu of Restaurant",
    categories: ["breakfast", "lunch", "dinner"],
    lastUpdated: new Date().toISOString().split("T")[0],
  });
});

// task 8

app.get("/maintenance", (req, res) => {
  res.status(503).send("We're down for maintenance, check back soon!");
});

//

app.listen(PORT, () => {
  console.log(`Server is Running http://localhost:${PORT}`);
});
