const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  try {
    const { firstName, surname, email, phoneNumber, message } = req.body;

    // Verilerin kontrolü
    if (!firstName || !surname || !email || !phoneNumber || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Veritabanına kaydetme
    const newContact = new Contact({
      firstName,
      surname,
      email,
      phoneNumber,
      message,
    });

    await newContact.save();
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
