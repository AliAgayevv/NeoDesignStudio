const Page = require("../models/Page");

exports.getPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { lang } = req.query;

    // Veritabanından sayfa verisini çek
    const pageData = await Page.findOne({ page });

    if (!pageData) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Dil kontrolü
    if (!["tr", "en", "ru"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language parameter." });
    }

    // İstenen dilde içerik döndür
    const content = pageData.content[lang];
    res.json({ page, content });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const { page, pageType, content } = req.body;

    // İçerik validasyonu
    if (!content.tr || !content.en || !content.ru) {
      return res
        .status(400)
        .json({ message: "All languages (tr, en, ru) must be provided." });
    }

    // Aynı sayfa daha önce eklenmiş mi?
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
