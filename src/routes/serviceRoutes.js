const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getService,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

router.route("/").get(getService).post(protect, createService);

router.route("/:id").put(protect, updateService).delete(protect, createService);

module.exports = router;
