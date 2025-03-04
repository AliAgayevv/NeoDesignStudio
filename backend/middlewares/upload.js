const multer = require("multer");
const path = require("path");

// Set up storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the folder where files will be saved
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Create a unique filename for each uploaded file
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 1633068894099.jpg
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Export the upload middleware to use in routes
module.exports = upload;
