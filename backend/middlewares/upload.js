// Backend - update your multer configuration
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Make sure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the absolute path
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Create the upload middleware, handling up to 10 images at once
const upload = multer({ storage });
module.exports = upload;

// Create a route to serve the images
// Add this to your Express app
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Make sure the route that handles the file upload returns the correct path
app.post("/api/upload", upload.single("image"), (req, res) => {
  // Return the path that can be used in the frontend
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = `/uploads/${path.basename(req.file.path)}`;
  return res.json({ filePath });
});
