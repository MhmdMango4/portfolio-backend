// utils/upload.js
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const validateFile = (file) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.mimitype)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WEBP, GIF allowed.");
  }

  if (file.size > maxSize) {
    throw new Error("File too large. Max 5M allowed");
  }
};

const uploadToCloudinary = (buffer, folder = "portfolio") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { upload, uploadToCloudinary };
