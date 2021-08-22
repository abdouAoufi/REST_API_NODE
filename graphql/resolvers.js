const bcrypt = require("bcryptjs");
const User = require("../models/User");

module.exports = {
  createUser: async function ({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User already exist!!");
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.name,
      name: userInput.name,
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
