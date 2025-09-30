const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
} = require("../controllers/contactController");

const router = express.Router();

router.route("/").post(createContactMessage).get(protect, getContactMessages);

router.route("/:id/read").put(protect, markMessageAsRead);

module.exports = router;
