const Page = require("../models/Page");

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

exports.patchPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { content } = req.body;

    // Mevcut page'i al
    const existingPage = await Page.findOne({ page });
    if (!existingPage) {
      return res.status(404).json({ message: "Page not found" });
    }

    // Mevcut content ile yeni content'i birleştir
    const updatedContent = { ...existingPage.content };

    Object.keys(content).forEach((lang) => {
      if (updatedContent[lang]) {
        updatedContent[lang] = { ...updatedContent[lang], ...content[lang] };
      } else {
        updatedContent[lang] = content[lang];
      }
    });

    const updatedPage = await Page.findOneAndUpdate(
      { page },
      { $set: { content: updatedContent } },
      { new: true }
    );

    res.json({ message: "Page updated successfully", page: updatedPage });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
