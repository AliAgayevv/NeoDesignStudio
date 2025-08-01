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

const ALLOWED_ORIGIN = "https://neodesignstudio.az";

app.use((req, res, next) => {
  const origin = req.headers.origin;

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

// ✅ ƏSAS DÜZƏLTMƏ: Static file serving əlavə edildi
app.use("/uploads", express.static(uploadsPath));

// İsteğe bağlı: Bütün public qovluğunu serve etmək
// app.use(express.static(path.join(__dirname, 'public')));

// Debug üçün əlavə məlumat
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath);
  console.log(`✅ Found ${files.length} files in uploads directory`);
  console.log(`📁 First 3 files: ${files.slice(0, 3).join(", ")}`);
} else {
  console.error(`❌ Uploads directory does not exist: ${uploadsPath}`);
}

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
  console.log(
    `🔗 Static files available at: http://localhost:${PORT}/uploads/`
  );
});

// optimizeImage middleware export
module.exports = { app, optimizeImage };
