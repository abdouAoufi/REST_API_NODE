const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");


exports.signup = (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  User.findOne({ email: email }).then((userDoc) => {
    if (userDoc) {
      return res.status(422).json({ message: "This email already exist !" });
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        res
          .status(201)
          .json({ message: "User signed up ", userId: result._id });
      })
      .catch((error) => {
        const err = new Error(error);
        err.statusCode = 500;
        throw err;
      });
  });
};
