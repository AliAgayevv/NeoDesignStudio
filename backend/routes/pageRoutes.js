const express = require("express");
const router = express.Router();
const {
  getPage,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

router.get("/:page", getPage);

router.post("/", createPage);

router.put("/:page", updatePage);
router.delete("/:page", deletePage);

module.exports = router;
