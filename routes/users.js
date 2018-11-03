const errors = require("restify-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../models/User");
const auth = require("../routes/auth");

module.exports = server => {
  // //////////////////////////////////////////////////
  // POST REGISTER/SIGNUP
  server.post("/register", (req, res, next) => {
    // Create New user
    const { email, password } = req.body;
    const user = new User({
      email,
      password
    });

    // BRCYPT STRATEGY
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // //////////////////////////////////////////////////
  // POST AUTH/LOGIN
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;

    try {
      // Auth User
      const user = await auth.authenticate(email, password);
      // Create JWT
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });

      const { iat, exp } = jwt.decode(token);
      // Responde with token
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // User unauthoreized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
