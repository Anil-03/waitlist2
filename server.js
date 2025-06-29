// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "waitlist_db",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// Create table if not exists
const tableQuery = `
  CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
db.query(tableQuery);

// API endpoint
app.post("/api/waitlist", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO waitlist (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "You're already enrolled!" });
      }
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json({ message: "Successfully enrolled! We'll update you soon." });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
