const express = require("express");
const router = express.Router();
const {
  getPage,
  createPage,
  updatePage,
  deletePage,
  patchPage,
} = require("../controllers/pageController");

router.get("/:page", getPage);

router.post("/", createPage);

router.put("/:page", updatePage);
router.patch("/:page", patchPage);

router.delete("/:page", deletePage);

module.exports = router;
