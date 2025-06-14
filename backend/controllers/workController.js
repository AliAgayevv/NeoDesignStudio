const Work = require("../models/Work");
const path = require("path");
const fs = require("fs");
const { cleanupFiles } = require("../middlewares/upload");

// Utility function for error responses
const sendError = (res, statusCode, message, error = null) => {
  console.error(`Error (${statusCode}): ${message}`, error);
  return res.status(statusCode).json({
    message,
    error: error?.message,
    timestamp: new Date().toISOString(),
  });
};

// Utility function for success responses
const sendSuccess = (res, data, message = "Success", statusCode = 200) => {
  console.log(`Success (${statusCode}): ${message}`);
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

exports.getWorkById = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { lang } = req.query;

    console.log(`Fetching work by ID: ${id}, language: ${lang || "all"}`);

    const project = await Work.findOne({ projectId: id });

    if (!project) {
      return sendError(res, 404, "Project not found.");
    }

    // If there any lang query, return the project with the specified language
    if (lang) {
      if (!["az", "en", "ru"].includes(lang)) {
        return sendError(
          res,
          400,
          "Language not supported. Use 'az', 'en', or 'ru'."
        );
      }

      const localizedProject = {
        projectId: project.projectId,
        images: project.images,
        area: project.area,
        category: project.category,
        description: project.description?.[lang] || project.description,
        title: project.title?.[lang] || project.title,
        location: project.location?.[lang] || project.location,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };

      return sendSuccess(res, localizedProject, `Project fetched in ${lang}`);
    }

    return sendSuccess(res, project, "Project fetched successfully");
  } catch (err) {
    return sendError(res, 500, "Server error while fetching project", err);
  }
};

exports.createWork = async (req, res) => {
  let uploadedFiles = [];

  try {
    console.log("Creating new work...");
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files?.length || 0);

    const { projectId, description, title, location, area, category } =
      req.body;

    // Validation
    if (!description || !description.az || !description.en || !description.ru) {
      if (req.files) cleanupFiles(req.files);
      return sendError(
        res,
        400,
        "All languages (az, en, ru) for description must be provided."
      );
    }

    if (!title || !title.az || !title.en || !title.ru) {
      if (req.files) cleanupFiles(req.files);
      return sendError(
        res,
        400,
        "All languages (az, en, ru) for title must be provided."
      );
    }

    if (!location || !location.az || !location.en || !location.ru) {
      if (req.files) cleanupFiles(req.files);
      return sendError(
        res,
        400,
        "All languages (az, en, ru) for location must be provided."
      );
    }

    if (!area) {
      if (req.files) cleanupFiles(req.files);
      return sendError(res, 400, "Area must be provided.");
    }

    if (!category) {
      if (req.files) cleanupFiles(req.files);
      return sendError(res, 400, "Category must be provided.");
    }

    // Process uploaded images
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files; // Store for cleanup on error
      uploadedImages = req.files.map(
        (file) => `/uploads/${file.filename || file.originalname}`
      );
      console.log(`Processed ${uploadedImages.length} images`);
    }

    // Check if there at least 1 image uploaded
    if (uploadedImages.length === 0) {
      return sendError(res, 400, "At least one image must be uploaded.");
    }

    // Check for existing project
    const existingProject = await Work.findOne({ projectId });
    if (existingProject) {
      if (req.files) cleanupFiles(req.files);
      return sendError(res, 400, "Work ID already exists.");
    }

    // Create new project
    const newProject = new Work({
      projectId,
      images: uploadedImages,
      description,
      title,
      location,
      area: parseInt(area),
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newProject.save();

    console.log(`✓ New work created successfully: ${projectId}`);
    return sendSuccess(res, newProject, "Work created successfully", 201);
  } catch (err) {
    console.error("Error creating work:", err);

    // Cleanup uploaded files on error
    if (uploadedFiles.length > 0) {
      console.log("Cleaning up uploaded files due to error...");
      cleanupFiles(uploadedFiles);
    }

    return sendError(res, 500, "Server error while creating work", err);
  }
};

exports.deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting work: ${id}`);

    const foundWork = await Work.findOne({ projectId: id });

    if (!foundWork) {
      return sendError(res, 404, "Project not found");
    }

    // Delete associated image files from filesystem
    if (foundWork.images && foundWork.images.length > 0) {
      console.log(`Deleting ${foundWork.images.length} associated images...`);

      foundWork.images.forEach((imagePath) => {
        try {
          const rootDir = path.resolve(__dirname, "..");
          const fullImagePath = path.join(rootDir, imagePath);

          if (fs.existsSync(fullImagePath)) {
            fs.unlinkSync(fullImagePath);
            console.log(`✓ Deleted image: ${imagePath}`);
          }
        } catch (fileError) {
          console.error(`Failed to delete image file: ${imagePath}`, fileError);
        }
      });
    }

    // Delete from database
    await Work.findOneAndDelete({ projectId: id });

    console.log(`✓ Work deleted successfully: ${id}`);
    return sendSuccess(res, { projectId: id }, "Project deleted successfully");
  } catch (err) {
    return sendError(res, 500, "Server error while deleting work", err);
  }
};

exports.updateWork = async (req, res) => {
  let uploadedFiles = [];

  try {
    const { id } = req.params; // projectId
    const { content } = req.body;

    console.log(`Updating work: ${id}`);
    console.log("Update content:", content);
    console.log("New files:", req.files?.length || 0);

    const project = await Work.findOne({ projectId: id });
    if (!project) {
      if (req.files) cleanupFiles(req.files);
      return sendError(res, 404, "Project not found.");
    }

    // Update content fields
    if (content) {
      try {
        const parsedContent =
          typeof content === "string" ? JSON.parse(content) : content;

        if (parsedContent.description) {
          project.description = {
            ...project.description,
            ...parsedContent.description,
          };
        }

        if (parsedContent.title) {
          project.title = {
            ...project.title,
            ...parsedContent.title,
          };
        }

        if (parsedContent.location) {
          project.location = {
            ...project.location,
            ...parsedContent.location,
          };
        }

        if (parsedContent.area) {
          project.area = parseInt(parsedContent.area);
        }

        if (parsedContent.category) {
          project.category = parsedContent.category;
        }
      } catch (parseError) {
        if (req.files) cleanupFiles(req.files);
        return sendError(
          res,
          400,
          "Invalid content format. Must be valid JSON.",
          parseError
        );
      }
    }

    // Process new uploaded images
    if (req.files && req.files.length > 0) {
      uploadedFiles = req.files;
      const uploadedImages = req.files.map(
        (file) => `/uploads/${file.filename || file.originalname}`
      );

      project.images = [...project.images, ...uploadedImages];
      console.log(`Added ${uploadedImages.length} new images to project`);
    }

    // Update timestamp
    project.updatedAt = new Date();

    // Save updated project
    await project.save();

    console.log(`✓ Work updated successfully: ${id}`);
    return sendSuccess(res, project, "Project updated successfully");
  } catch (err) {
    console.error("Error updating project:", err);

    // Cleanup uploaded files on error
    if (uploadedFiles.length > 0) {
      console.log("Cleaning up uploaded files due to error...");
      cleanupFiles(uploadedFiles);
    }

    return sendError(res, 500, "Server error while updating work", err);
  }
};

exports.getAllWorks = async (req, res) => {
  try {
    console.log("Fetching all works...");

    const projects = await Work.find().sort({ createdAt: -1 }); // Daha performanslı sorting

    console.log(`✓ Fetched ${projects.length} works`);

    // Cache headers (routes'da da set ediliyor ama burada da güvence için)
    res.set({
      "X-Total-Count": projects.length.toString(),
      "X-Cache-Status": "MISS",
    });

    return sendSuccess(
      res,
      projects,
      `${projects.length} projects fetched successfully`
    );
  } catch (err) {
    return sendError(res, 500, "Server error while fetching all works", err);
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params; // projectId
    const { imagePath } = req.body;

    console.log(`Deleting image from work ${id}: ${imagePath}`);

    if (!imagePath) {
      return sendError(res, 400, "Image path is required");
    }

    const project = await Work.findOne({ projectId: id });
    if (!project) {
      return sendError(res, 404, "Project not found");
    }

    if (project.images.length === 1) {
      return sendError(
        res,
        400,
        "Cannot delete the last image from the project"
      );
    }

    // Check if the image exists in the project
    const imageIndex = project.images.indexOf(imagePath);
    if (imageIndex === -1) {
      return sendError(res, 404, "Image not found in project");
    }

    // Remove the image from the filesystem
    try {
      const rootDir = path.resolve(__dirname, "..");
      const fullImagePath = path.join(rootDir, imagePath);

      if (fs.existsSync(fullImagePath)) {
        fs.unlinkSync(fullImagePath);
        console.log(`✓ Deleted image file: ${imagePath}`);
      } else {
        console.warn(`Image file not found on filesystem: ${imagePath}`);
      }
    } catch (fsError) {
      console.error(`Failed to delete image file: ${imagePath}`, fsError);
      // Continue with database update even if file deletion fails
    }

    // Remove from database
    project.images.splice(imageIndex, 1);
    project.updatedAt = new Date();
    await project.save();

    console.log(`✓ Image removed from project: ${imagePath}`);

    return sendSuccess(
      res,
      {
        deletedImage: imagePath,
        remainingImages: project.images,
        totalImages: project.images.length,
      },
      "Image deleted successfully"
    );
  } catch (err) {
    return sendError(res, 500, "Server error while deleting image", err);
  }
};

exports.getWorkByCategory = async (req, res) => {
  const categoryTypes = ["interior", "exterior", "business", "all"];

  try {
    const { category } = req.query;

    console.log(`Fetching works by category: ${category}`);

    if (category && !categoryTypes.includes(category)) {
      return sendError(
        res,
        400,
        `Category type '${category}' is not supported. Use: ${categoryTypes.join(
          ", "
        )}`
      );
    }

    let projects;

    if (!category || category === "all") {
      // Get all projects
      projects = await Work.find().sort({ createdAt: -1 });
      console.log(`✓ Fetched all ${projects.length} works`);
    } else {
      // Get projects by category
      projects = await Work.find({ category }).sort({ createdAt: -1 });
      console.log(
        `✓ Fetched ${projects.length} works in category '${category}'`
      );
    }

    // Set cache headers with category info
    res.set({
      "X-Total-Count": projects.length.toString(),
      "X-Category": category || "all",
      "X-Cache-Status": "MISS",
    });

    return sendSuccess(
      res,
      projects,
      `${projects.length} projects fetched for category '${category || "all"}'`
    );
  } catch (err) {
    return sendError(
      res,
      500,
      "Server error while fetching works by category",
      err
    );
  }
};
