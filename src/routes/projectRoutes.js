const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { upload } = require("../middleware/uploadMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getProjects)
  .post(protect, upload.single("image"), createProject);

router.route("/:id").put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;
