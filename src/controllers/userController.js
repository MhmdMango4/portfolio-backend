const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { validationResult } = require("express-validator");

// Register controller
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (process.env.NODE_ENV !== "development") {
    return res.status(403).json({
      success: false,
      message: "Registration disabled in production",
    });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  // Check userExists
  const userExists = await User.findOne({ username });

  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  // Create User
  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({
      message: "Invalid user data",
    });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find by username
  const user = await User.findOne({ username });

  // Check if user exists AND password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

module.exports = { registerUser, loginUser };
