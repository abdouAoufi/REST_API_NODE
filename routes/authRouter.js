const express = require("express");
const { body } = require("express-validator");
const AuthController = require("../controllers/Auth");
const User = require("../models/User");
const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email!!")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().notEmpty(),
  ],
  AuthController.signup
);

router.post("/login" , AuthController.login)
module.exports = router;
