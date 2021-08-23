const bcrypt = require("bcryptjs");
const User = require("../models/User");
const validator = require("validator");

exports.signup = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "email is not valid" });
    }
    if(validator.isEmpty(userInput.password) || !validator.isLength(userInput.password , {min : 5})){
      errors.push({ message: "password is not valid" });
    }

    if(errors.length > 0 ) {
      const error = new Error("Invalid input");
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User already exist!!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email: userInput.email,
      password: hashedPw,
    });
    const created = await user.save();
    // ! that's what we care about !
    return {
      ...created._doc,
      _id: created._id.toString(),
    };
  },
};

exports.operation = {
  resolveOperation: ({ userInput }, req) => {
    return userInput.num1 + userInput.num2;
  },
};
