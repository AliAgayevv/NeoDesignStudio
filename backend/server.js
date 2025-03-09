const express = require("express");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");
const contactRoute = require("./routes/contact");
const cors = require("cors");
const uploads = require("./middlewares/upload");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend development server
      "https://demo-neodesignstudio.vercel.app", // Production URL
    ],
  })
);

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Replaces bodyParser.json()

// Static file serving (uploads folder) - be more explicit
const uploadsPath = path.resolve(__dirname, "public/uploads");
console.log("Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// Add this fallback to handle the case if files are in middleware directory
const middlewarePath = path.resolve(__dirname, "middlewares/uploads");
console.log("Fallback serving from:", middlewarePath);
app.use(
  "/opt/render/project/src/backend/middlewares/uploads",
  express.static(middlewarePath)
);

// Debug endpoint to check uploads directory
app.get("/debug/uploads", (req, res) => {
  const uploadPath = path.join(__dirname, "public/uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
        configuredPath: uploadPath,
        currentDir: __dirname,
      });
    }
    res.json({
      files,
      configuredPath: uploadPath,
      currentDir: __dirname,
    });
  });
});

// Utility endpoint to fix image paths in the database
app.get("/fix-image-paths", async (req, res) => {
  try {
    const Work = require("./models/Work"); // Make sure to import your Work model
    const works = await Work.find({});
    for (const work of works) {
      const updatedImages = work.images.map((img) => {
        // Extract just the filename from the full path
        const filename = img.split("/").pop();
        return `/uploads/${filename}`;
      });
      work.images = updatedImages;
      await work.save();
    }
    res.json({ message: "Fixed image paths", count: works.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
