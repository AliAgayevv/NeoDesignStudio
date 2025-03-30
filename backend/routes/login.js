const express = require("express");
const router = express.Router();
const process = require("process");
const jwt = require("jsonwebtoken"); // Add this for JWT support

// Secret key for JWT signing (use a strong, random value in production)
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check credentials
    if (
      email === process.env.ADMIN_LOGIN &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create JWT payload
      const payload = {
        user: {
          email: email,
          role: "admin",
        },
      };

      // Generate token with expiration (e.g., 1 hour)
      jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          message: "Login successful.",
          token: token,
        });
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

router.post("/verify", authMiddleware, (req, res) => {
  // If token is valid, return user information
  res.json({ user: req.user });
});

// Example of a protected route
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
