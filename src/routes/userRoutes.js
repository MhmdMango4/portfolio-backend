const express = require("express");
const { body } = require("express-validator");
const { registerUser, loginUser } = require("../controllers/userController");

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 chars"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 chars"),
  ],
  registerUser
);

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
