const Page = require("../models/Page");

exports.getPage = async (req, res) => {
  try {
    const { page } = req.params;
    const { lang } = req.query;

    if (!lang) {
      return res
        .status(400)
        .json({ message: "Language parameter is required." });
    }

    if (!["az", "en", "ru", "tr"].includes(lang)) {
      return res.status(400).json({ message: "Invalid language parameter." });
    }

    const allPages = await Page.find({}, { page: 1, _id: 0 });

    const pageData = await Page.findOne({ page });

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
    console.error("❌ Error fetching page:", err);
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
