const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./db");
const pageRoutes = require("./routes/pageRoutes");
const workRoutes = require("./routes/workRoutes");

const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

const PORT = 4000;

// Middleware
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/pages", pageRoutes);
app.use("/api/portfolio", workRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
