const express = require("express");
const router = express.Router();
const {
  deleteWork,
  updateWork,
  createWork,
  getWorkById,
  getAllWorks,
} = require("../controllers/workController");

// Import Multer middleware
const upload = require("../middlewares/upload");

// Create a new work/project (with multiple file uploads)
router.post("/", upload.array("images", 10), createWork);

// Get work by ID
router.get("/:id", getWorkById);

router.get("/", getAllWorks);

// Delete work by ID
router.delete("/:id", deleteWork);

// Update work by ID (with multiple file uploads)
router.put("/:id", upload.array("images", 10), updateWork);

module.exports = router;
