// server.js (improved)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db"); // should return a Promise
const behaviorRoutes = require("./routes/behavior");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger (helps debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} → ${req.method} ${req.url}`);
  next();
});

// Health route for fast checks (Postman / curl)
app.get("/ping", (req, res) => res.send("pong"));

// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/behavior", behaviorRoutes);
app.use("/api/seed", require("./routes/seed"));

// Serve frontend (if exists)
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

// Fallback to main.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "main.html"));
});

const PORT = process.env.PORT || 5000;

// Attempt to connect to DB, but ALWAYS start server to avoid hanging requests
(async function start() {
  try {
    // connectDB should return a Promise that resolves when connected or rejects on error
    await connectDB(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error(
      "❌ MongoDB connection error (continuing without DB):",
      err && err.message ? err.message : err,
    );
    // If you want to fail the process instead, uncomment the next line:
    // process.exit(1);
  } finally {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
})();
