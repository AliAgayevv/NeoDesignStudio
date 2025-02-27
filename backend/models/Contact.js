const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

module.exports = Contact;
