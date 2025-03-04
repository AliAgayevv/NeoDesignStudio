const multer = require("multer");
const path = require("path");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder for uploaded files
    const uploadDir = path.join(__dirname, "../uploads");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create a unique file name for each uploaded file
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// Multer file filter (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed."), false);
  }
};

// Create the upload instance with storage and file filter configuration
const upload = multer({ storage, fileFilter });

// Export the upload instance
module.exports = upload;
