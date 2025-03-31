const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.resolve(__dirname, "../public/uploads");
console.log("Upload directory set to:", uploadDirectory);

if (!fs.existsSync(uploadDirectory)) {
  console.log("Creating upload directory:", uploadDirectory);
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

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
