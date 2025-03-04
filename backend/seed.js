const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

// Logging utility
const logger = {
  info: (message) => console.log(`\x1b[34m[INFO]\x1b[0m ${message}`),
  error: (message) => console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`),
  success: (message) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`),
};

// Detailed error logging function
function logDetailedError(error) {
  logger.error("Detailed Error Information:");

  if (error.response) {
    // The request was made and the server responded with a status code
    logger.error(`Status Code: ${error.response.status}`);
    logger.error(
      `Response Data: ${JSON.stringify(error.response.data, null, 2)}`
    );
    logger.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
  } else if (error.request) {
    // The request was made but no response was received
    logger.error("No response received");
    logger.error(`Request: ${error.request}`);
  } else {
    // Something happened in setting up the request
    logger.error(`Error Message: ${error.message}`);
  }
}

// Validate image files before upload
function validateImageFiles(imagePaths) {
  const validImagePaths = imagePaths.filter((imagePath) => {
    if (!fs.existsSync(imagePath)) {
      logger.error(`Image file not found: ${imagePath}`);
      return false;
    }

    const stats = fs.statSync(imagePath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB > 10``) {
      logger.error(`Image ${imagePath} is too large (>${5}MB)`);
      return false;
    }

    return true;
  });

  return validImagePaths;
}

// Flatten content object for form data
function flattenContent(content) {
  const flatContent = {};
  Object.keys(content).forEach((lang) => {
    Object.keys(content[lang]).forEach((key) => {
      flatContent[`content[${lang}][${key}]`] = content[lang][key];
    });
  });
  return flatContent;
}

async function uploadProject(project) {
  try {
    // Validate images first
    const validImagePaths = validateImageFiles(project.images);

    if (validImagePaths.length === 0) {
      throw new Error("No valid images found for upload");
    }

    // Create FormData
    const formData = new FormData();

    // Append project ID
    formData.append("projectId", project.projectId);

    // Append multilingual content
    const flatContent = flattenContent(project.content);
    Object.entries(flatContent).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append images
    validImagePaths.forEach((imagePath) => {
      formData.append("images", fs.createReadStream(imagePath));
    });

    logger.info(`Uploading project: ${project.projectId}`);

    // Send POST request with detailed configuration
    const response = await axios.post(
      "https://neodesignstudio.onrender.com/api/portfolio",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          // Optional: Add timeout and content length limits
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 30000, // 30 seconds timeout
      }
    );

    logger.success(`Successfully uploaded project: ${project.projectId}`);
    return response.data;
  } catch (error) {
    logDetailedError(error);
    throw error;
  }
}

async function seedDatabase() {
  logger.info("Starting database seeding...");

  const projectsData = [
    {
      projectId: "web-design-001",
      content: {
        az: {
          title: "Veb Dizayn Layihəsi",
          description: "Müasir və responsiv veb dizayn həlli",
          category: "Veb Dizayn",
        },
        en: {
          title: "Modern Web Design Project",
          description: "Cutting-edge responsive web design solution",
          category: "Web Design",
        },
        ru: {
          title: "Проект веб-дизайна",
          description: "Современное адаптивное веб-решение",
          category: "Веб-дизайн",
        },
      },
      images: [
        path.join(__dirname, "dummy-images", "project1.jpeg"),
        path.join(__dirname, "dummy-images", "project2.jpeg"),
      ],
    },
    {
      projectId: "branding-002",
      content: {
        az: {
          title: "Brend Kimliyi Layihəsi",
          description: "Şirkət üçün tam brend strategiyası",
          category: "Brend Dizaynı",
        },
        en: {
          title: "Corporate Branding Project",
          description: "Comprehensive branding strategy for a leading company",
          category: "Branding",
        },
        ru: {
          title: "Проект фирменного стиля",
          description: "Комплексная стратегия брендинга",
          category: "Брендинг",
        },
      },
      images: [
        path.join(__dirname, "dummy-images", "project5.png"),
        path.join(__dirname, "dummy-images", "project6.jpeg"),
      ],
    },
    {
      projectId: "ux-ui-003",
      content: {
        az: {
          title: "UX/UI Dizayn Layihəsi",
          description: "İstifadəçi təcrübəsinə əsaslanan innovativ dizayn",
          category: "UX/UI Dizayn",
        },
        en: {
          title: "UX/UI Design Project",
          description: "User-centric innovative design solution",
          category: "UX/UI Design",
        },
        ru: {
          title: "Проект UX/UI дизайна",
          description: "Инновационное решение с фокусом на пользователя",
          category: "UX/UI Дизайн",
        },
      },
      images: [
        path.join(__dirname, "dummy-images", "project3.jpeg"),
        path.join(__dirname, "dummy-images", "project4.jpeg"),
      ],
    },
  ];

  try {
    for (const project of projectsData) {
      await uploadProject(project);
      // Add delay between uploads
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    logger.success("Seeding completed successfully!");
  } catch (error) {
    logger.error("Seeding failed:");
    logDetailedError(error);
  }
}

// Run the seeding script
seedDatabase();
