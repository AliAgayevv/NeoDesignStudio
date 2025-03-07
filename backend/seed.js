const mongoose = require("mongoose");
const Work = require("./models/Work"); // Adjust the path if needed
const fs = require("fs");
const path = require("path");

// Dummy data for seed
const sampleWorks = [
  {
    projectId: "work1",
    content: {
      az: { title: "Az Work 1", description: "Az description for work 1" },
      en: {
        title: "English Work 1",
        description: "Description for work 1 in English",
      },
      ru: {
        title: "Russian Work 1",
        description: "Описание работы 1 на русском",
      },
    },
    images: ["dummy-images/project1.jpeg", "dummy-images/project2.jpeg"],
  },
  {
    projectId: "work2",
    content: {
      az: { title: "Az Work 2", description: "Az description for work 2" },
      en: {
        title: "English Work 2",
        description: "Description for work 2 in English",
      },
      ru: {
        title: "Russian Work 2",
        description: "Описание работы 2 на русском",
      },
    },
    images: ["dummy-images/project3.jpeg", "dummy-images/project4.jpeg"],
  },
  // Add more projects as needed
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/neoDesign", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Remove all existing data
    await Work.deleteMany({});

    // Insert sample works into the database
    await Work.insertMany(sampleWorks);

    console.log("Dummy data inserted successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error.message);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
};

// Call the function to seed the database
seedDatabase();
