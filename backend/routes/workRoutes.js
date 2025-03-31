const express = require("express");
const router = express.Router();
const {
  deleteWork,
  updateWork,
  createWork,
  getWorkById,
  getAllWorks,
  deleteImage,
} = require("../controllers/workController");

const upload = require("../middlewares/upload");

router.post("/", upload.array("images", 25), createWork);

router.get("/:id", getWorkById);

router.get("/", getAllWorks);

router.delete("/:id", deleteWork);

router.put("/:id", upload.array("images", 10), updateWork);

router.delete("/:id/images", deleteImage);

module.exports = router;
