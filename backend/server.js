const express = require("express");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");
const contactRoute = require("./routes/contact");
const cors = require("cors");
const uploads = require("./middlewares/upload");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000", // Frontend development server
      "https://demo-neodesignstudio.vercel.app", // Production URL
    ],
  })
);

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json()); // Replaces bodyParser.json()

// Static file serving (uploads folder)
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/contact", contactRoute);
app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
