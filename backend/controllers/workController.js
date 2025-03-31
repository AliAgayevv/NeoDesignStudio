const Work = require("../models/Work");

exports.getWorkById = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { lang } = req.query;

    const project = await Work.findOne({ projectId: id });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // If there any lang query, return the project with the specified language, otheriwse return the entire project
    if (lang) {
      if (!["az", "en", "ru"].includes(lang)) {
        return res.status(400).json({ message: "Language not supported." });
      }

      return res.json({
        projectId: project.projectId,
        images: project.images,
        area: project.area,
        description: project.description[lang],
        title: project.title[lang],
        location: project.location[lang],
      });
    }

    return res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.createWork = async (req, res) => {
  try {
    const { projectId, description, title, location, area } = req.body;

    if (!description || !description.az || !description.en || !description.ru) {
      return res.status(400).json({
        message: "All languages (az, en, ru) for description must be provided.",
      });
    }

    if (!title || !title.az || !title.en || !title.ru) {
      return res.status(400).json({
        message: "All languages (az, en, ru) for title must be provided.",
      });
    }

    if (!location || !location.az || !location.en || !location.ru) {
      return res.status(400).json({
        message: "All languages (az, en, ru) for location must be provided.",
      });
    }

    if (!area) {
      return res.status(400).json({ message: "Area must be provided." });
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(
        (file) => `/uploads/${file.filename || file.originalname}`
      );
    }
    // Check if there at least 1 image uploaded
    if (uploadedImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image must be uploaded." });
    }

    const existingProject = await Work.findOne({ projectId });
    if (existingProject) {
      return res.status(400).json({ message: "Work ID already exists." });
    }

    // Create on db
    const newProject = new Work({
      projectId,
      images: uploadedImages,
      description,
      title,
      location,
      area,
    });
    await newProject.save();
    res.status(201).json({ message: "Work created successfully", newProject });
  } catch (err) {
    console.error(err);
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

    console.log("req.body", req.body);

    const project = await Work.findOne({ projectId: id });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // content = description, title, location, and area (if provided)
    if (content) {
      if (content.description) {
        project.description = {
          ...project.description,
          ...content.description, // Merge with existing description
        };
      }
      if (content.title) {
        project.title = {
          ...project.title,
          ...content.title, // Merge with existing title
        };
      }
      if (content.location) {
        project.location = {
          ...project.location,
          ...content.location, // Merge with existing location
        };
      }
      if (content.area) {
        project.area = content.area; // Update area if provided
      }
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(
        (file) => `/uploads/${file.filename || file.originalname}`
      );
      project.images = [...project.images, ...uploadedImages]; // Add new images to exisitng images array
    }

    // Save updated project with new content || images
    await project.save();
    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("Error updating project:", err);
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

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ message: "Image path is required" });
    }

    const project = await Work.findOne({ projectId: id });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the image exists in the project
    const imageIndex = project.images.indexOf(imagePath);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in project" });
    }

    // Remove the image from the filesystem if it exists
    try {
      const rootDir = path.resolve(__dirname, "..");
      const fullImagePath = path.join(rootDir, imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath);
      }
    } catch (fsError) {
      console.error(`Failed to delete image file: ${imagePath}`, fsError);
    }

    project.images.splice(imageIndex, 1);

    await project.save();

    res.json({
      message: "Image deleted successfully",
      remainingImages: project.images,
    });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
