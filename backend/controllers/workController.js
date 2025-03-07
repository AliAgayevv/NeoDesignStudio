const Work = require("../models/Work");

exports.getWorkById = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { lang } = req.query;

    // Find the project by projectId
    const project = await Work.findOne({ projectId: id });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // If a language query param is provided, return only that language's content
    if (lang) {
      if (!project.content[lang]) {
        return res
          .status(400)
          .json({ message: "Content not available in this language." });
      }
      return res.json({
        projectId: project.projectId,
        images: project.images,
        content: project.content[lang],
      });
    }

    // If no language param, return the entire project document
    return res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createWork = async (req, res) => {
  try {
    // Destructure text fields from the body
    const { projectId, content } = req.body;

    // Collect the uploaded image file paths
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => file.path);
    }

    // Validate the content object
    if (!content || !content.az || !content.en || !content.ru) {
      return res
        .status(400)
        .json({ message: "All languages (az, en, ru) must be provided." });
    }

    // Validate that images were uploaded
    if (uploadedImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image must be uploaded." });
    }

    // Check if projectId already exists
    const existingProject = await Work.findOne({ projectId });
    if (existingProject) {
      return res.status(400).json({ message: "Work ID already exists." });
    }

    // Create the new document in MongoDB
    const newProject = new Work({
      projectId,
      images: uploadedImages,
      content,
    });

    await newProject.save();

    res.status(201).json({ message: "Work created successfully", newProject });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const findedWork = await Work.findOneAndDelete({ projectId: id });
    if (!findedWork)
      return res.status(404).json({ message: "Project Not Found" });

    res.json({ message: "Project deleted succesfully", findedWork });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateWork = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { content } = req.body;

    // Find the existing project by ID
    const project = await Work.findOne({ projectId: id });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Handle newly uploaded images
    // Decide if you want to REPLACE or APPEND
    // (Below, we REPLACE the existing images array entirely)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      project.images = newImages;
    }

    // If your request body has "images" as an array of direct URLs,
    // you could handle that here too. For example:
    // if (req.body.images) {
    //   project.images = req.body.images;
    // }

    // Update content if provided
    if (content) {
      // Option 1: Merge into existing content
      project.content = { ...project.content, ...content };
      // Option 2: Completely overwrite
      // project.content = content;
    }

    await project.save();
    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllWorks = async (req, res) => {
  try {
    const projects = await Work.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
