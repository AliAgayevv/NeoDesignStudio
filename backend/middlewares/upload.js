const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Upload directory ayarları
const uploadDirectory = path.resolve(__dirname, "../public/uploads");
console.log("Upload directory set to:", uploadDirectory);

// Upload klasörünü oluştur
if (!fs.existsSync(uploadDirectory)) {
  console.log("Creating upload directory:", uploadDirectory);
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

// MIME type kontrolü
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
];

// Dosya uzantısı kontrolü
const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|avif)$/i;

// Dosya filtresi - Güvenlik için
const fileFilter = (req, file, cb) => {
  console.log(`Checking file: ${file.originalname}, MIME: ${file.mimetype}`);

  // MIME type kontrolü
  if (!allowedMimeTypes.includes(file.mimetype)) {
    console.log(`Rejected file due to MIME type: ${file.mimetype}`);
    return cb(
      new Error(
        `Desteklenmeyen dosya tipi: ${file.mimetype}. Sadece resim dosyaları yükleyebilirsiniz.`
      ),
      false
    );
  }

  // Dosya uzantısı kontrolü
  if (!allowedExtensions.test(file.originalname)) {
    console.log(
      `Rejected file due to extension: ${path.extname(file.originalname)}`
    );
    return cb(
      new Error(
        `Desteklenmeyen dosya uzantısı. Sadece JPG, PNG, GIF, WebP, AVIF dosyaları yükleyebilirsiniz.`
      ),
      false
    );
  }

  console.log(`File approved: ${file.originalname}`);
  cb(null, true);
};

// Güvenli dosya adı oluşturucu
const generateSafeFilename = (originalname) => {
  // Dosya uzantısını al
  const ext = path.extname(originalname).toLowerCase();

  // Orijinal dosya adını temizle (sadece alfanumerik karakterler)
  const baseName = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9]/g, "_") // Özel karakterleri _ ile değiştir
    .substring(0, 20); // Maksimum 20 karakter

  // Unique ID oluştur
  const timestamp = Date.now();
  const randomBytes = crypto.randomBytes(8).toString("hex");

  // Final filename
  const filename = `${baseName}_${timestamp}_${randomBytes}${ext}`;

  return filename;
};

// Storage konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Saving file to:", uploadDirectory);
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const safeFilename = generateSafeFilename(file.originalname);
    console.log(
      `Generated safe filename: ${safeFilename} (from ${file.originalname})`
    );
    cb(null, safeFilename);
  },
});

// Ana multer konfigürasyonu
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB maksimum dosya boyutu
    files: 10, // Maksimum 10 dosya
    fieldSize: 1024 * 1024, // 1MB field boyutu
  },
});

// Error handling wrapper
const uploadWithErrorHandling = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);

        // Multer specific errors
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            return res.status(400).json({
              error: "FILE_TOO_LARGE",
              message: "Dosya boyutu çok büyük. Maksimum 50MB olmalıdır.",
              code: "LIMIT_FILE_SIZE",
            });
          case "LIMIT_FILE_COUNT":
            return res.status(400).json({
              error: "TOO_MANY_FILES",
              message: "Çok fazla dosya. Maksimum 10 dosya yükleyebilirsiniz.",
              code: "LIMIT_FILE_COUNT",
            });
          case "LIMIT_FIELD_KEY":
            return res.status(400).json({
              error: "FIELD_NAME_TOO_LONG",
              message: "Field adı çok uzun.",
              code: "LIMIT_FIELD_KEY",
            });
          case "LIMIT_FIELD_VALUE":
            return res.status(400).json({
              error: "FIELD_VALUE_TOO_LONG",
              message: "Field değeri çok uzun.",
              code: "LIMIT_FIELD_VALUE",
            });
          case "LIMIT_UNEXPECTED_FILE":
            return res.status(400).json({
              error: "UNEXPECTED_FIELD",
              message: "Beklenmeyen dosya alanı.",
              code: "LIMIT_UNEXPECTED_FILE",
            });
          default:
            return res.status(400).json({
              error: "UPLOAD_ERROR",
              message: "Dosya yükleme hatası: " + err.message,
              code: err.code,
            });
        }
      } else if (err) {
        console.error("Custom Upload Error:", err);
        return res.status(400).json({
          error: "CUSTOM_ERROR",
          message: err.message || "Dosya yükleme hatası.",
          code: "CUSTOM_ERROR",
        });
      }

      // Success - Log uploaded files
      if (req.file) {
        console.log(
          `✓ Single file uploaded successfully: ${req.file.filename} (${(
            req.file.size /
            1024 /
            1024
          ).toFixed(2)}MB)`
        );
      }

      if (req.files && req.files.length > 0) {
        console.log(
          `✓ Multiple files uploaded successfully: ${req.files.length} files`
        );
        req.files.forEach((file, index) => {
          console.log(
            `  ${index + 1}. ${file.filename} (${(
              file.size /
              1024 /
              1024
            ).toFixed(2)}MB)`
          );
        });
      }

      next();
    });
  };
};

// Cleanup function for failed uploads
const cleanupFiles = (files) => {
  if (!files) return;

  const fileArray = Array.isArray(files) ? files : [files];

  fileArray.forEach((file) => {
    if (file.path && fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
        console.log(`🗑️ Cleaned up file: ${file.filename}`);
      } catch (cleanupErr) {
        console.error(`Failed to cleanup file ${file.filename}:`, cleanupErr);
      }
    }
  });
};

// Export different upload configurations
module.exports = {
  // Orijinal upload (backward compatibility)
  upload,

  // Single file upload with error handling
  single: uploadWithErrorHandling(upload.single("image")),

  // Multiple files upload with error handling
  multiple: uploadWithErrorHandling(upload.array("images", 10)),

  // Large files (for special cases)
  large: uploadWithErrorHandling(
    multer({
      storage: storage,
      fileFilter: fileFilter,
      limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
        files: 5,
      },
    }).array("images", 5)
  ),

  // Utility functions
  cleanupFiles,
  uploadDirectory,
  generateSafeFilename,

  // Raw multer instance for custom configurations
  multerInstance: multer,
  storage: storage,
  fileFilter: fileFilter,
};
