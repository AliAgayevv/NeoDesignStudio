const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true }, // Benzersiz proje ID'si
  page: { type: String, required: true }, // Sayfa türü
  pageType: { type: String, default: "static" }, // Sayfa tipi
  images: { type: [String], default: [] }, // Fotoğraf URL'leri (dillerden bağımsız)
  content: {
    az: {
      type: Object,
      required: true,
    },
    en: {
      type: Object,
      required: true,
    },
    ru: {
      type: Object,
      required: true,
    },
  },
});

module.exports = mongoose.model("Work", ProjectSchema);
