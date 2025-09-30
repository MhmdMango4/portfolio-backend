const asyncHandler = require("../middleware/asyncHandler");
const Project = require("../models/Project");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/uploadMiddleware");

// @desc Get all projects
// @routes GET /api/v1/projects
// @access Public
const getProjects = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i", // fixed
        },
      }
    : {};

  const tagFilter = req.query.tag ? { tag: { $in: [req.query.tag] } } : {};

  // Count documents with filters
  const count = await Project.countDocuments({ ...keyword, ...tagFilter });

  // Apply filters, pagination, sorting
  const projects = await Project.find({ ...keyword, ...tagFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    projects,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Create new project
// @route   POST /api/v1/projects
// @access  Private (admin only)
// controllers/projectController.js
const createProject = asyncHandler(async (req, res) => {
  const { title, description, liveUrl, githubUrl, tags } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Please include title and description" });
  }

  let imageUrl = "";
  if (req.file) {
    try {
      validateFile(req.file);
      const result = await uploadToCloudinary(req.file.buffer, "projects");
      imageUrl = result.secure_url;
    } catch (error) {
      return res.status(500).json({
        message: "Image upload failed",
        error: error.message,
      });
    }
  }

  const project = await Project.create({
    title,
    description,
    imageUrl,
    liveUrl,
    githubUrl,
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  });

  res.status(201).json({ success: true, project });
});
// @desc    Update a project
// @route   PUT /api/v1/projects/:id
// @access  Private (admin only)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.param.id);

  if (!project) {
    res.status(404).json({
      message: "Project not found",
    });
  }

  const updateProject = await Project.findByIdAndUpdate(
    req.param.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    project: updatedProject,
  });
});

// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
// @access  Private (admin only)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404).json({
      message: "Project not found",
    });
  }

  if (project.imageUrl) {
    try {
      const urlParts = proejct.imageUrl.split("/");
      const publicIdWithExtention = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtention.split(".")[0];
      const folder = "proejcts";
      const fullPublicId = `${folder}/${publicId}`;

      await uploadToCloudinary.uploader.destroy(fullPublicId);
      console.log(`✅ Image deleted from Cloudinary: ${fullPublicId}`);
    } catch (error) {
      console.error(
        "❌ Failed to delete image from Cloudinary:",
        error.message
      );
    }
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
  });
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
