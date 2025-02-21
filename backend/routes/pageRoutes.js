const express = require("express");
const router = express.Router();
const {
  getPage,
  createPage,
  updatePage,
} = require("../controllers/pageController");

// Get
router.get("/:page", getPage);

// Create
router.post("/", createPage);

// Update
router.put("/:page", updatePage);

module.exports = router;
