const express = require("express");
const router = express.Router();
const {
  getPage,
  createPage,
  updatePage,
} = require("../controllers/pageController");

router.get("/:page", getPage);

router.post("/", createPage);

router.put("/:page", updatePage);

module.exports = router;
