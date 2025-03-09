const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use absolute path to create uploads directory
const uploadDirectory = path.resolve(__dirname, "../public/uploads");
console.log("Upload directory set to:", uploadDirectory);

// Check if the directory exists, and create it if it doesn't
if (!fs.existsSync(uploadDirectory)) {
  console.log("Creating upload directory:", uploadDirectory);
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// Set up storage engine with the correct directory and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to:", uploadDirectory);
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}_${file.originalname}`;
    console.log("Generated filename:", uniqueFilename);
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });
module.exports = upload;
