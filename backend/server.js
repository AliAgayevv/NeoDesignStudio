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
      "https://neodesignstudio.onrender.com", // Add your Render domain
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Add this if you're using cookies/sessions
  })
);

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Created uploads directory");
}

// Static file serving with better debugging
app.use(
  "/uploads",
  (req, res, next) => {
    const requestedFile = path.join(__dirname, "uploads", req.path);
    console.log(`File requested: ${requestedFile}`);
    console.log(`File exists: ${fs.existsSync(requestedFile)}`);
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

// Add a test endpoint to check file paths
app.get("/api/test-uploads", (req, res) => {
  try {
    const files = fs.readdirSync(uploadsDir);
    res.json({
      message: "Upload directory contents",
      directory: uploadsDir,
      files: files,
      exists: fs.existsSync(uploadsDir),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error reading upload directory",
      error: error.message,
    });
  }
});

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);

// 404 handler for image paths
app.use("/uploads/*", (req, res) => {
  console.log(`404 for file: ${req.url}`);
  res.status(404).send("File not found");
});

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
  console.log(`Uploads directory: ${uploadsDir}`);
});
