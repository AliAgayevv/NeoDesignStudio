const express = require("express");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");
const contactRoute = require("./routes/contact");
const loginRoutes = require("./routes/login");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const compression = require("compression");

const app = express();

// ✅ Sıkı CORS middleware
const ALLOWED_ORIGIN = "https://neodesignstudio.az";

app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Eğer origin yoksa (same-origin istek), izin ver
  const isSameOrigin = !origin;
  const isAllowedOrigin = origin === ALLOWED_ORIGIN;

  if (!isSameOrigin && !isAllowedOrigin) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Bu kaynaktan erişim izni yok.",
      code: 403,
    });
  }

  // Eğer CORS gerekiyorsa header ekle (sadece cross-origin'de gerekli)
  if (origin && isAllowedOrigin) {
    res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  }

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Middleware'ler
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(compression({ level: 6, threshold: 1024 }));

// 🔧 Görsel Yükleme Yolu
const uploadsPath = path.resolve(__dirname, "public/uploads");
console.log("Serving static files from:", uploadsPath);

// ✅ Statik dosyalarda da CORS ve güvenlik kontrolü
app.use(
  "/uploads",
  (req, res, next) => {
    const origin = req.headers.origin;
    if (!origin || origin !== ALLOWED_ORIGIN) {
      return res.status(403).json({
        error: "Forbidden",
        message: "Bu kaynaktan statik dosyalara erişim izni yok.",
        code: 403,
      });
    }

    res.set({
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
      "Cache-Control": "public, max-age=31536000",
      Expires: new Date(Date.now() + 31536000000).toUTCString(),
      "Last-Modified": new Date().toUTCString(),
      ETag: `"${Date.now()}"`,
      Vary: "Accept-Encoding",
    });

    next();
  },
  express.static(uploadsPath, {
    maxAge: "1y",
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        res.set("Content-Type", "image/" + path.split(".").pop().toLowerCase());
      }
    },
  })
);

// Görsel optimizasyon middleware'i
const optimizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const { filename, path: filePath } = req.file;
    const outputDir = path.dirname(filePath);
    const nameWithoutExt = path.parse(filename).name;
    const ext = path.parse(filename).ext.toLowerCase();

    if (![".jpg", ".jpeg", ".png", ".gif"].includes(ext)) return next();

    console.log(`Optimizing image: ${filename}`);

    const sizes = [
      { width: 400, height: 300, suffix: "small" },
      { width: 800, height: 600, suffix: "medium" },
      { width: 1200, height: 900, suffix: "large" },
    ];

    const optimizationPromises = sizes.map((size) => {
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
        .webp({ quality: 75, effort: 4, lossless: false })
        .toFile(outputPath);
    });

    const originalOptimizedPath = path.join(
      outputDir,
      `${nameWithoutExt}-optimized${ext}`
    );
    optimizationPromises.push(
      sharp(filePath)
        .jpeg({ quality: 85, progressive: true })
        .png({ compressionLevel: 8, progressive: true })
        .toFile(originalOptimizedPath)
    );

    await Promise.all(optimizationPromises);
    fs.renameSync(originalOptimizedPath, filePath);

    console.log(`Image optimization completed for: ${filename}`);
    next();
  } catch (error) {
    console.error("Image optimization error:", error);
    next();
  }
};

// 📦 Route tanımları
connectDB();
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);
app.use("/api/login", loginRoutes);

// Hata yönetimi
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

// Sunucuyu başlat
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// optimizeImage middleware export
module.exports = { app, optimizeImage };
