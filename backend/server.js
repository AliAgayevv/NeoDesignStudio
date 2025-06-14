const express = require("express");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");
const contactRoute = require("./routes/contact");
const loginRoutes = require("./routes/login");
const cors = require("cors");
const uploads = require("./middlewares/upload");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp"); // Görsel optimizasyonu için

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://45.85.146.73:3000",
  "https://45.85.146.73:3000",
  "https://neodesignstudio.az",
  "https://www.neodesignstudio.az",
];

// CORS optimizasyonu
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
    optionsSuccessStatus: 200, // Legacy browser desteği
    maxAge: 86400, // 24 saat preflight cache
  })
);

const PORT = 4000;

// Middleware optimizasyonu
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Compression middleware (performans için)
const compression = require("compression");
app.use(
  compression({
    level: 6, // Sıkıştırma seviyesi
    threshold: 1024, // 1KB'den büyük dosyalar
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);

// Static file serving optimization
const uploadsPath = path.resolve(__dirname, "public/uploads");
console.log("Serving static files from:", uploadsPath);

// Cache kontrolü ile static file serving
app.use(
  "/uploads",
  (req, res, next) => {
    // Cache headers ekle
    res.set({
      "Cache-Control": "public, max-age=31536000", // 1 yıl cache
      Expires: new Date(Date.now() + 31536000000).toUTCString(),
      "Last-Modified": new Date().toUTCString(),
      ETag: `"${Date.now()}"`,
      Vary: "Accept-Encoding",
    });

    // CORS headers
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    });

    next();
  },
  express.static(uploadsPath, {
    maxAge: "1y", // 1 yıl cache
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Görsel dosyaları için özel headers
      if (path.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        res.set("Content-Type", "image/" + path.split(".").pop().toLowerCase());
      }
    },
  })
);

// Fallback static serving
const middlewarePath = path.resolve(__dirname, "middlewares/uploads");
console.log("Fallback serving from:", middlewarePath);
app.use(
  "/opt/render/project/src/backend/middlewares/uploads",
  express.static(middlewarePath, { maxAge: "1y" })
);

// Görsel optimizasyonu middleware'i
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const { filename, path: filePath } = req.file;
    const outputDir = path.dirname(filePath);
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext.toLowerCase();

    // Sadece görsel dosyalarını işle
    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) {
      return next();
    }

    console.log(`Optimizing image: ${filename}`);

    // Farklı boyutlarda görseller oluştur
    const sizes = [
      { width: 400, height: 300, suffix: "small" },
      { width: 800, height: 600, suffix: "medium" },
      { width: 1200, height: 900, suffix: "large" },
    ];

    const optimizationPromises = sizes.map(async (size) => {
      const outputPath = path.join(
        outputDir,
        `${nameWithoutExt}-${size.suffix}.webp`
      );

      return sharp(filePath)
        .resize(size.width, size.height, {
          fit: "cover",
          position: "center",
          withoutEnlargement: true,
        })
        .webp({
          quality: 75,
          effort: 4,
          lossless: false,
        })
        .toFile(outputPath);
    });

    // Orijinal dosyayı da optimize et
    const originalOptimizedPath = path.join(
      outputDir,
      `${nameWithoutExt}-optimized${ext}`
    );
    const originalOptimization = sharp(filePath)
      .jpeg({ quality: 85, progressive: true })
      .png({ compressionLevel: 8, progressive: true })
      .toFile(originalOptimizedPath);

    optimizationPromises.push(originalOptimization);

    // Tüm optimizasyonları bekle
    await Promise.all(optimizationPromises);

    console.log(`Image optimization completed for: ${filename}`);

    // Orijinal dosyayı optimize edilmiş versiyonla değiştir
    fs.renameSync(originalOptimizedPath, filePath);

    next();
  } catch (error) {
    console.error("Image optimization error:", error);
    // Hata olsa bile devam et
    next();
  }
};

// Database bağlantısı
connectDB();

// Routes
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);
app.use("/api/login", loginRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: "File too large",
      message: "Dosya boyutu çok büyük. Maksimum 50MB olmalıdır.",
    });
  }

  res.status(500).json({
    error: "Internal server error",
    message: "Sunucu hatası oluştu.",
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Export optimizeImage middleware for use in routes
module.exports = { app, optimizeImage };
