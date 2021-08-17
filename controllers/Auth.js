const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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

// login controller

exports.login = (req, res, next) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
      bcrypt.compare(password, user.password).then((domatch) => {
        if (domatch) {
          const token = jwt.sign(
            {
              email: user.email,
              userId: user._id.toString(),
            },
            "secretlongermore",
            { expiresIn: "1h" }
          );
          return res.status(200).json({ token: token, userId: user._id.toString() });
        } else {
          res.status(400).json({ message: "Incorrect data " });
        }
      });
    })
    .catch((err) => {
      const error = new Error(err);
      if (!err.statusCode) {
        error.statusCode = 404;
      }
      next(error);
    });
};
