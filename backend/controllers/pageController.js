const Page = require("../models/Page");
const multer = require("multer");
const path = require("path");

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

exports.getPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { lang } = req.query;

    const allPages = await Page.find({}, { page: 1, _id: 0 });

    const pageData = await Page.findOne({ page });

    if (!lang) {
      return res.status(200).json({
        message:
          "Language not specified. Returning selected page with all languages.",
        pages: pageData,
      });
    }

    if (!["az", "en", "ru"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language parameter." });
    }

    if (!pageData) {
      return res.status(404).json({ message: "Page not found" });
    }

    if (!pageData.content || !pageData.content[lang]) {
      return res
        .status(404)
        .json({ message: `Content not found for language: ${lang}` });
    }

    res.json({ page: pageData.page, content: pageData.content[lang] });
  } catch (err) {
    console.error("Error fetching page:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const { page, pageType, content } = req.body;

    if (!content.az || !content.en || !content.ru) {
      return res
        .status(400)
        .json({ message: "All languages (az, en, ru) must be provided." });
    }

    const existingPage = await Page.findOne({ page });
    if (existingPage) {
      return res.status(400).json({ message: "Page already exists" });
    }

    const newPage = new Page({ page, pageType, content });
    await newPage.save();

    res
      .status(201)
      .json({ message: "Page created successfully", page: newPage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body;

    const updatedPage = await Page.findOneAndUpdate(
      { page },
      { content },
      { new: true }
    );

    if (!updatedPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.json({ message: "Page updated", page: updatedPage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.patchPage = [
  upload.array("images", 10), // maksimum 10 dosya
  async (req, res) => {
    try {
      const { page } = req.params;

      // Mevcut page'i al
      const existingPage = await Page.findOne({ page });
      if (!existingPage) {
        return res.status(404).json({ message: "Page not found" });
      }

      // Upload edilen dosyaların path'lerini al
      const imagePaths = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      // Mevcut content'i koru
      const updatedContent = { ...existingPage.content };

      // Eğer content body'de varsa onu da ekle
      if (req.body.content) {
        const content = JSON.parse(req.body.content);
        Object.keys(content).forEach((lang) => {
          if (updatedContent[lang]) {
            updatedContent[lang] = {
              ...updatedContent[lang],
              ...content[lang],
            };
          } else {
            updatedContent[lang] = content[lang];
          }
        });
      }

      // Images varsa her dile ekle
      if (imagePaths.length > 0) {
        Object.keys(updatedContent).forEach((lang) => {
          if (!updatedContent[lang].images) {
            updatedContent[lang].images = [];
          }
          updatedContent[lang].images.push(...imagePaths);
        });
      }

      const updatedPage = await Page.findOneAndUpdate(
        { page },
        { $set: { content: updatedContent } },
        { new: true }
      );

      res.json({
        message: "Page updated successfully",
        page: updatedPage,
        uploadedImages: imagePaths,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
];

exports.deletePage = async (req, res) => {
  try {
    const { page } = req.params;

    console.log(`Deleting page: ${page}`);
    const deletedPage = await Page.findOneAndDelete({ page });
    if (!deletedPage) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json({ message: "Page deleted successfully", page: deletedPage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
