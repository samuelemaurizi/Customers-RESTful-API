const mongoose = require("mongoose");
const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
// Strategy to import a mongoose Schema
// against a possible error
const User = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Get User by email
      const user = await User.findOne({ email });

      // Match the password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          // Pass didn't match
          reject("Authentication failed!");
        }
      });
    } catch (err) {
      // Email not found
      reject("Authentication failed! Banana!");
    }
  });
};
