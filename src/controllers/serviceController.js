const asyncHandler = require("../middleware/asyncHandler");
const Service = require("../models/Service");

// Get all services
const getService = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Service.countDocuments({ ...keyword });
  const services = await Service.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    services,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// Create new service
const createService = asyncHandler(async (req, res) => {
  const { title, description, icon } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Please include title and description",
    });
  }

  const service = await Service.create({
    title,
    description,
    icon,
  });

  return res.status(201).json({
    success: true,
    message: "Created successfully",
    service,
  });
});

// Update service
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.param.id);

  if (!service) {
    return res.status(404).json({
      message: "Service not found",
    });
  }

  const updateService = await Service.findByIdAndUpdate(
    req.param.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    message: "Service updated",
    updateService,
  });
});

// Delete service
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.param.id);

  if (!service) {
    return res.status(404).json({
      success: false,
      message: "Service not found",
    });
  }

  await service.deleteOne();
  res.status(200).json({
    success: true,
    message: "Service removed",
  });
});

module.exports = {
  getService,
  createService,
  updateService,
  deleteService,
};
