require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (e.g. Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

// When running as a Vercel Service behind the /api/backend routePrefix,
// requests arrive with that prefix still attached. Strip it here so the
// same route definitions work locally, on Render, and on Vercel.
app.use((req, res, next) => {
  if (req.url.startsWith("/api/backend")) {
    req.url = req.url.replace("/api/backend", "") || "/";
  }
  next();
});

app.get("/", (req, res) => res.json({ message: "Task Manager API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// must be registered last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));