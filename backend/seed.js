const mongoose = require("mongoose");
const Page = require("./models/Page");
const connectDB = require("./db");

// create data for test backend and db

const seedData = async () => {
  await connectDB();

  const homePage = new Page({
    page: "portfolio",
    content: {
      en: {
        title: "Welcome to our site",
        description: "We provide the best services for you.",
      },
      tr: {
        title: "Sitemize Hoş Geldiniz",
        description: "Sizin için en iyi hizmetleri sunuyoruz.",
      },
    },
  });

  await homePage.save();
  console.log("Data seeded");
  mongoose.connection.close();
};

seedData();
