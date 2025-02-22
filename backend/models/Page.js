const mongoose = require("mongoose");

const PageSchema = new mongoose.Schema({
  page: { type: String, required: true },
  pageType: { type: String, required: true },
  content: {
    az: { type: Object, required: true }, //
    en: { type: Object, required: true },
    ru: { type: Object, required: true },
  },
});

module.exports = mongoose.model("Page", PageSchema);
