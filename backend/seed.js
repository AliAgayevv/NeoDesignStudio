const axios = require("axios");
const faker = require("faker");
const fs = require("fs");

// Function to generate a random number of dummy images for a project
function generateDummyImages() {
  const images = [];
  const numImages = faker.datatype.number({ min: 1, max: 5 }); // Random number of images (1-5)

  for (let i = 0; i < numImages; i++) {
    // Generate random dummy image URLs (for testing purposes, you could change this logic)
    images.push(`https://via.placeholder.com/150?text=Image+${i + 1}`);
  }

  return images;
}

// Function to create dummy content for each language
function generateDummyContent() {
  return {
    az: {
      title: faker.company.companyName(),
      description: faker.lorem.paragraph(),
    },
    en: {
      title: faker.company.companyName(),
      description: faker.lorem.paragraph(),
    },
    ru: {
      title: faker.company.companyName(),
      description: faker.lorem.paragraph(),
    },
  };
}

// Main function to post dummy data to your API
async function seedData() {
  const numberOfProjects = 10; // Number of dummy projects to post

  for (let i = 0; i < numberOfProjects; i++) {
    const projectId = faker.datatype.uuid();
    const content = generateDummyContent();
    const images = generateDummyImages();

    const newProject = {
      projectId,
      content,
      images, // Include the image URLs
    };

    try {
      const response = await axios.post(
        "https://neodesignstudio.onrender.com/api/portfolio",
        newProject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Project ${projectId} created successfully:`, response.data);
    } catch (error) {
      console.error(
        `Error creating project ${projectId}:`,
        error.response ? error.response.data : error.message
      );
    }
  }
}

// Run the seed function
seedData();
