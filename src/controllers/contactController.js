const asyncHandler = require("../middleware/asyncHandler");
const ContactMessage = require("../models/ContactMessage");

// Create new contact message
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      message: "Plesae fill all fields",
    });
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message send successfully",
    data: contactMessage,
  });
});

// Get all contacg messages
const getContactMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    messages,
  });
});

// const mark message as read
const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  message.read = true;
  await message.save;

  res.status(200).json({
    success: true,
    message: "Message marked as read",
    data: message,
  });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
};
