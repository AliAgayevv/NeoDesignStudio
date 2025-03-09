const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  images: { type: [String], default: [] },
  description: {
    az: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
  },
  title: {
    az: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
  },
  location: {
    az: {
      type: String,
      required: true,
    },
    en: {
      type: String,
      required: true,
    },
    ru: {
      type: String,
      required: true,
    },
  },
  area: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Work", ProjectSchema);
