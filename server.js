// server.js
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST,
  user: process.env.MYSQLUSER || process.env.MYSQL_USER,
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT || process.env.MYSQL_PORT,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection pool error:', err);
  } else {
    console.log('✅ MySQL connection pool ready');
    connection.release(); // Don't forget to release the connection!
  }
});


// Create table if not exists
const tableQuery = `
  CREATE TABLE IF NOT EXISTS user_waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    
  );
`;
db.query(tableQuery);

app.get('/', (req, res) => {
  res.send('API is running');
});

// API endpoint
app.post("/api/waitlist", (req, res) => {
  const { name, email } = req.body;
  console.log("Received:", name, email);

  if (!name || !email) {
    console.log("Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO user_waitlist (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error("DB error:", err); // 👈 This will show the real problem
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "You're already enrolled!" });
      }
      return res.status(500).json({ message: "Server error" });
    }

    res.status(200).json({ message: "Successfully enrolled! We'll update you soon." });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
