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
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://demo-neodesignstudio.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Add this middleware to prevent direct access
// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   const referer = req.headers.referer;

//   // Allow direct access to static files
//   if (req.path.startsWith("/uploads/")) {
//     return next();
//   }

//   // If origin header exists and is in allowed origins, allow the request
//   if (origin && allowedOrigins.includes(origin)) {
//     return next();
//   }

//   // If referer exists, check if it starts with any allowed origin
//   if (referer) {
//     for (const allowedOrigin of allowedOrigins) {
//       if (referer.startsWith(allowedOrigin)) {
//         return next();
//       }
//     }
//   }

//   // Block requests that don't have proper origin/referer
//   // But add special exception for development environment
//   if (process.env.NODE_ENV === "development") {
//     return next(); // Allow all requests in development mode
//   }

//   // For production, block direct access
//   return res.status(403).json({
//     error: "Direct access not allowed",
//     message: "Please access this API through the allowed client applications",
//   });
// });

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Static file serving (uploads folder)
const uploadsPath = path.resolve(__dirname, "public/uploads");
console.log("Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

const middlewarePath = path.resolve(__dirname, "middlewares/uploads");
console.log("Fallback serving from:", middlewarePath);
app.use(
  "/opt/render/project/src/backend/middlewares/uploads",
  express.static(middlewarePath)
);

connectDB();

app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);
app.use("/api/login", loginRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
