const express = require("express");
const router = express.Router();
const {
  deleteWork,
  updateWork,
  createWork,
  getWorkById,
  getAllWorks,
  deleteImage,
  getWorkByCategory,
} = require("../controllers/workController");

const upload = require("../middlewares/upload");

router.post("/", upload.array("images", 25), createWork);

router.get("/:id", getWorkById);

router.get("/", (req, res) => {
  if (req.query.category) {
    return getWorkByCategory(req, res);
  } else {
    return getAllWorks(req, res);
  }
});

router.delete("/:id", deleteWork);

router.put("/:id", upload.array("images", 10), updateWork);

router.delete("/:id/images", deleteImage);

module.exports = router;
