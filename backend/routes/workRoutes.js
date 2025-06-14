const express = require("express");
const router = express.Router();
const {
  deleteWork,
  updateWork,
  createWork,
  getWorkById,
  getAllWorks,
  deleteImage,
  getWorkByCategory,
} = require("../controllers/workController");

// Yeni optimize edilmiş upload middleware'ini import edin
const { upload, cleanupFiles } = require("../middlewares/upload");

// Performance monitoring middleware
const performanceLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );

    // Log slow requests (5 saniyeden uzun)
    if (duration > 5000) {
      console.warn(
        `⚠️  Slow request: ${req.method} ${req.originalUrl} took ${duration}ms`
      );
    }
  });

  next();
};

// Cache control middleware
const setCacheHeaders = (req, res, next) => {
  if (req.method === "GET") {
    res.set({
      "Cache-Control": "public, max-age=300", // 5 dakika cache
      Vary: "Accept-Encoding",
      "Last-Modified": new Date().toUTCString(),
    });
  }
  next();
};

// Apply middleware to all routes
router.use(performanceLogger);
router.use(setCacheHeaders);

// Upload error handling wrapper
const handleUploadError = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err);

        // Cleanup uploaded files on error
        if (req.files && req.files.length > 0) {
          cleanupFiles(req.files);
        }

        // Handle specific multer errors
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            error: "FILE_TOO_LARGE",
            message: "Dosya boyutu çok büyük. Maksimum 50MB olmalıdır.",
          });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            error: "TOO_MANY_FILES",
            message: "Çok fazla dosya yüklendi.",
          });
        }

        return res.status(400).json({
          error: "UPLOAD_ERROR",
          message: err.message || "Dosya yükleme hatası.",
        });
      }

      // Log successful uploads
      if (req.files && req.files.length > 0) {
        console.log(`✓ ${req.files.length} dosya başarıyla yüklendi`);
        req.files.forEach((file) => {
          console.log(
            `  - ${file.filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`
          );
        });
      }

      next();
    });
  };
};

// CREATE - Yeni work oluştur (maksimum 25 görsel)
router.post("/", handleUploadError(upload.array("images", 25)), createWork);

// READ - Tek work getir (uzun cache)
router.get(
  "/:id",
  (req, res, next) => {
    // Individual work için daha uzun cache
    res.set({
      "Cache-Control": "public, max-age=600", // 10 dakika cache
    });
    next();
  },
  getWorkById
);

// READ - Tüm works veya kategoriye göre getir
router.get("/", (req, res) => {
  console.log(`Query params:`, req.query);

  if (req.query.category) {
    console.log(`Fetching works by category: ${req.query.category}`);
    return getWorkByCategory(req, res);
  } else {
    console.log("Fetching all works");
    return getAllWorks(req, res);
  }
});

// UPDATE - Work güncelle (maksimum 10 yeni görsel)
router.put("/:id", handleUploadError(upload.array("images", 10)), updateWork);

// DELETE - Work sil
router.delete(
  "/:id",
  (req, res, next) => {
    console.log(`Deleting work: ${req.params.id}`);
    next();
  },
  deleteWork
);

// DELETE - Belirli görsel sil
router.delete(
  "/:id/images",
  (req, res, next) => {
    console.log(`Deleting image from work: ${req.params.id}`);

    // Image silindikten sonra cache'i temizle
    res.set({
      "Cache-Control": "no-cache",
    });

    next();
  },
  deleteImage
);

// Global error handler for this router
router.use((error, req, res, next) => {
  console.error("Work Route Error:", error);

  // Cleanup any uploaded files on error
  if (req.files && req.files.length > 0) {
    console.log("Cleaning up uploaded files due to error...");
    cleanupFiles(req.files);
  }

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Sunucu hatası oluştu.",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

module.exports = router;
