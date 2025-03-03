const express = require("express");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");
const contactRoute = require("./routes/contact");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Initialize Express
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend development server
      "https://demo-neodesignstudio.vercel.app", // Production URL
      "https://demo-neodesignstudio.vercel.app/projects",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Important for form data

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Static file serving (uploads folder)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack);
  res.status(500).json({
    message: "Server error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
