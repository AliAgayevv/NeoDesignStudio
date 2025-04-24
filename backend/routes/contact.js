const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const process = require("process");

// helper function for delete contacts which are older than 30 days
const deleteOldContacts = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Contact.deleteMany({
      sentedTime: { $lt: thirtyDaysAgo },
    });
    console.log(`Deleted ${result.deletedCount} old contact forms.`);
  } catch (error) {
    console.error("Error deleting old contacts:", error);
  }
};

router.post("/", async (req, res) => {
  try {
    const { firstName, surname, email, phoneNumber, message } = req.body;

    if (!firstName || !surname || !email || !phoneNumber || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const sentedTime = new Date();

    const newContact = new Contact({
      firstName,
      surname,
      email,
      phoneNumber,
      message,
      sentedTime,
    });

    await newContact.save();

    // Run the cleanup function to delete old contacts every time a new form is submitted
    await deleteOldContacts();

    //  Telegram notification
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const messageText = `New contact form submission:\n\nName: ${firstName} ${surname}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nMessage: ${message}`;

    const data = {
      chat_id: chatId,
      text: messageText,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch(url, options);

    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

router.get("/", async (req, res) => {
  try {
    // Cleanup old contacts before fetching
    await deleteOldContacts();

    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

module.exports = router;
