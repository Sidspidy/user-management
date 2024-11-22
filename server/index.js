const express = require("express");
const users = require("./samle.json");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
const port = 8000;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// Display all users
app.get("/users", (req, res) => {
  return res.status(200).json(users);
});

// Add a new user
app.post("/users", (req, res) => {
  const { name, email, website } = req.body;

  // Validate request body
  if (!name || !email || !website) {
    return res.status(400).send({ message: "All fields are required." });
  }

  const id = Date.now(); // Generate unique ID
  users.push({ id, name, email, website });

  fs.writeFile("./samle.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).send({ message: "Error writing to file." });
    }
    return res.status(201).json({ message: "User added successfully.", id });
  });
});

// Delete a user
app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const filteredUsers = users.filter((user) => user.id !== id);

  if (filteredUsers.length === users.length) {
    return res.status(404).send({ message: "User not found." });
  }

  fs.writeFile("./samle.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      return res.status(500).send({ message: "Error writing to file." });
    }
    return res.status(200).json({ message: "User deleted successfully." });
  });
});

// Update a user
app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, email, website } = req.body;

  // Validate request body
  if (!name || !email || !website) {
    return res.status(400).send({ message: "All fields are required." });
  }

  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    return res.status(404).send({ message: "User not found." });
  }

  users[userIndex] = { id, name, email, website }; // Update user data

  fs.writeFile("./samle.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).send({ message: "Error writing to file." });
    }
    return res.status(200).json({ message: "User updated successfully." });
  });
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    return;
  }
  console.log(`Server is running on http://localhost:${port}`);
});
